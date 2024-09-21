import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as xmlbuilder from 'xmlbuilder';
import { parseStringPromise, Builder } from 'xml2js';
import { CXML } from './entities/amazon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { POStatus, PurchaseOrder } from 'src/db/schemas/PurchaseOrder';
import { LineItem } from 'src/db/schemas/LineItem';
import { Organization, OrgSettings, User } from 'src/db/schemas';
import { EncryptionService } from 'src/encryption/encryption.service';
import { Supplier } from 'src/db/schemas/Supplier';
import * as xml2js from 'xml2js';
import { PurchasingService } from 'src/purchasing/purchasing.service';

@Injectable()
export class AmazonService {
  private readonly punchoutUrl: string;
  private readonly punchoutTestUrl: string;
  private readonly poRequestUrl: string;
  private readonly sharedSecret: string;
  private readonly fromIdentity: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel('PurchaseOrder')
    private readonly purchaseOrderModel: Model<PurchaseOrder>,
    @InjectModel('LineItem') private readonly lineItemModel: Model<LineItem>,
    @InjectModel('Organization')
    private readonly organizationModel: Model<Organization>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Supplier') private readonly supplierModel: Model<Supplier>,
    private readonly encryptService: EncryptionService,
    private readonly purchasingService: PurchasingService,
  ) {
//     AMZ_FROM_ID=RiguAI7376222135
// AMZ_SHARED_SECRET=ZPmRNdCzJQV5QgPpadQBeNNRLMCdy6
// AMZ_PUNCHOUT_URL_TEST=https://www.amazon.com/eprocurement/punchout/test
// AMZ_PUNCHOUT_URL=https://www.amazon.com/eprocurement/punchout
// AMZ_PURCHASE_ORDER_REQUEST_URL=https://https-ats.amazonsedi.com/d73dd50d-61ce-4ac4-bb4d-bc31f4e5e8f2
// AMZ_POST_BACK_URL=http://localhost:6060/api/punchouts/amazon/order
// ENCRYPTION_KEY=UYrfl0gg9wXgG/15OsDSCdVH4B+5kuKyVw4kyQTW9Jo=
    this.punchoutUrl = 'https://www.amazon.com/eprocurement/punchout';
    this.punchoutTestUrl = 'https://www.amazon.com/eprocurement/punchout/test';
    // this.poRequestUrl = process.env.AMZ_PURCHASE_ORDER_REQUEST_URL;
    // this.sharedSecret = process.env.AMZ_SHARED_SECRET;
    // this.fromIdentity = process.env.AMZ_FROM_ID;
  }

  async setupCXMLEnvelope(
    payloadId: string,
    creds: {
      punchoutEnabled: string;
      punchoutUrl: string;
      punchoutSecret: string;
      punchoutIdentity: string;
      owner: string;
    },
  ) {
    // CREDS   {"punchoutEnabled":"true","punchoutUrl":"https://https-ats.amazonsedi.com/d73dd50d-61ce-4ac4-bb4d-bc31f4e5e8f2","punchoutSecret":"ZPmRNdCzJQV5QgPpadQBeNNRLMCdy6","punchoutIdentity":"RiguAI7376222135","owner":"6657613c32a41b8769a79eba"}

    const cxml = xmlbuilder
      .create('cXML', { version: '1.0', encoding: 'UTF-8' })
      .att('payloadID', payloadId)
      .att('timestamp', new Date().toISOString())
      .att('version', '1.2.014')
      .ele('Header')
      .ele('From')
      .ele('Credential', { domain: 'NetworkId' })
      .ele('Identity', creds.punchoutIdentity)
      .up()
      .up()
      .up() // Close From
      .ele('To')
      .ele('Credential', { domain: 'NetworkId' })
      .ele('Identity', 'Amazon')
      .up()
      .up()
      .up() // Close To
      .ele('Sender')
      .ele('Credential', { domain: 'NetworkId' })
      .ele('Identity', creds.punchoutIdentity)
      .up()
      .ele('SharedSecret', creds.punchoutSecret)
      .up()
      .up() // Close Credential
      .ele('UserAgent', 'Test')
      .up()
      .up() // Close Sender
      .up(); // Close Header

    return cxml;
  }

  async createPunchOutSetupRequest(
    userToken: string,
    useTestEnvironment: boolean,
  ): Promise<string> {
    const url = useTestEnvironment ? this.punchoutTestUrl : this.punchoutUrl;
    const user = await this.userModel.findOne({
      id: userToken,
    });

    const email =
      user.email === 'jason@morrigu.ai' ? 'superstar@morrigu.ai' : user.email;

    if (!user) {
      throw new Error('User not found');
    }

    // find the org they belong to
    const org = await this.organizationModel.findOne({
      users: user._id,
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const creds = await this.getCredentials(org._id, 'amzn_punchout');

    const cxml = await this.setupCXMLEnvelope(email, JSON.parse(creds));

    const cxmlPayload = cxml
      .ele('Request', {
        deploymentMode: useTestEnvironment ? 'test' : 'production',
      })
      .ele('PunchOutSetupRequest')
      .ele('BuyerCookie', userToken)
      .up()
      .ele('BrowserFormPost')
      .ele('URL', `${process.env.BACKEND_API_URL}/api/punchouts/amazon/order`)
      .up()
      .up() // Close BrowserFormPost
      .ele('SupplierSetup')
      .ele('URL', url)
      .up()
      .up() // Close SupplierSetup
      .ele('Contact')
      .ele('Email', email)
      .up() // Replace with the actual user email
      .up() // Close Contact
      .ele('Extrinsic', { name: 'UserEmail' }, email)
      .up() // Add Extrinsic for UserEmail
      .ele('Extrinsic', { name: 'Email' }, email)
      .up() // Additional Extrinsic for Email
      .up() // Close PunchOutSetupRequest
      .up() // Close Request
      .end({ pretty: true });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: cxmlPayload,
    });

    if (!response.ok) {
      const errorResponse = await response.text();

      throw new Error(
        `Failed to create PunchOut setup request: ${response.statusText}`,
      );
    }

    const data = await response.text();
    // You will need to parse the cXML response to extract the PunchOut URL or other information.

    // convert the cXML response to JSON
    const json = await parseStringPromise(data);

    return json?.['cXML']['Response'][0];
  }

  async handlePunchOutOrderMessage(pomData: any) {
    // Extract order details from the PunchOut Order Message (POM)
    const orderDetails = pomData?.['cxml-urlencoded'];

    const json: {
      cXML: CXML;
    } = await parseStringPromise(orderDetails, (err, result) => {
      console.log(result);
    });

    console.log(JSON.stringify(json, null, 2));

    // Save the order details to your database (you'll need to implement this)
    const savedOrder = await this.saveOrder(json);

    return savedOrder;
  }

  async saveOrder(orderDetails: { cXML: CXML }) {
    const payloadId = orderDetails.cXML.$.payloadID;
    const owner =
      orderDetails.cXML.Message[0].PunchOutOrderMessage[0].BuyerCookie[0];

    console.log('OWNER', owner);

    const user = await this.userModel.findOne({
      id: owner,
    });

    console.log('USER', user);

    // find the organization by that contains a user with the buyer cookie
    const org = await this.organizationModel.findOne({
      users: user._id,
    });

    if (!org) {
      throw new Error('Organization not found for user');
    }

    //TODO: check if they have it enabled for punchout

    const supplier = await this.supplierModel.findById(
      '66d2465da38a52fbe1a22922', // this is amazon dev
    );

    console.log('SUPPLIER', supplier);

    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const timestamp = orderDetails.cXML.$.timestamp;
    const order = orderDetails.cXML.Message[0].PunchOutOrderMessage[0];

    const { ItemIn, PunchOutOrderMessageHeader, BuyerCookie } = order;

    const po = await new this.purchaseOrderModel({
      po_number: payloadId,
      orderDate: new Date(timestamp), // Assuming timestamp is a valid date string
      deliveryDate: new Date(timestamp).setDate(
        new Date(timestamp).getDate() + 7,
      ),
      totalAmount: PunchOutOrderMessageHeader?.[0]?.Total[0]?.Money[0]?._,
      status: POStatus.Draft,
      terms: 'Net 30',
      raw: orderDetails,
      type: 'amzn_punchout',
      history: [
        {
          status: POStatus.Draft,
          timestamp: new Date(timestamp),
          actionBy: user,
          metadata: {},
        },
      ],
      owner: org,
      createdBy: user,
      supplier,
    }).save();

    const items = ItemIn.map((item) => {
      return new this.lineItemModel({
        po_number: po._id,
        productName: `${item?.ItemDetail[0]?.ManufacturerPartID[0]}` || '',
        description: item?.ItemDetail[0]?.Description[0]?._,
        quantity: item?.$?.quantity,
        price: item?.ItemDetail[0]?.UnitPrice[0]?.Money[0]?._,
        totalPrice: item?.ItemDetail[0]?.UnitPrice[0]?.Money[0]?._,
        raw: item,
        type: 'amzn_punchout',
        punchoutDefails: PunchOutOrderMessageHeader,
      });
    });

    const result = await this.lineItemModel.insertMany(items);

    if (!result) {
      throw new Error('Failed to save line items');
    }

    po.line_items = result.map((item) => item._id);

    const newPo = await po.save();

    if (!newPo) {
      throw new Error('Failed to save purchase order');
    }

    return {
      message: 'Order saved successfully',
      po,
    };
  }

  // <Status text="failure" code="403">CXML POSR with payloadId {1725067048122.566.5114@amazon.com} is missing the
  //           following Mandatory data. The HOOK URL element, found at
  //           /cXML/Request/PunchOutSetupRequest/BrowserFormPost/URL, is missing. The EMAIL element, found at
  //           /cXML/Request/PunchOutSetupRequest//Extrinsic[@name='UserEmail'] (or)
  //           /cXML/Request/PunchOutSetupRequest//ShipTo/Address/Email (or)
  //           /cXML/Request/PunchOutSetupRequest//Contact/Email (or)
  //           /cXML/Request/PunchOutSetupRequest//Extrinsic[@name='Email'], is missing.</Status>

  async sendPurchaseOrder(
    poId: string,
    owner: string,
    useTestEnvironment: boolean = false,
  ) {
    const url = useTestEnvironment ? this.punchoutTestUrl : this.punchoutUrl;

    const po = await this.purchaseOrderModel
      .findOne({ po_number: poId })
      .populate('line_items');

    if (!po) {
      throw new Error('Purchase order not found');
    }

    const user = await this.userModel.findOne({
      id: owner,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const email =
      user.email === 'jason@morrigu.ai' ? 'superstar@morrigu.ai' : user.email;

    const org = await this.organizationModel.findOne({
      users: user._id,
    });

    if (!org) {
      throw new Error('Organization not found for user');
    }

    // get the creds

    const creds = await this.getCredentials(org._id, 'amzn_punchout');

    const cxml = await this.setupCXMLEnvelope(po._id, JSON.parse(creds));

    let payload = cxml
      .ele('Request')
      .ele('OrderRequest')
      .ele('OrderRequestHeader', {
        orderID: po._id,
        type: 'new',
        orderDate: new Date().toISOString(),
      })

      .ele('Contact')
      .ele('Email', email)
      .up()
      .up() // Close Contact
      .ele('ShipTo')
      .ele('Address')
      .ele('Name', 'Jason Walker')
      .up()
      .ele('PostalAddress')
      .ele('DeliverTo', 'Jason Walker')
      .up()
      .ele('Street', '1057 Via Saint Andrea Pl')
      .up()
      .ele('City', 'Henderson')
      .up()
      .ele('State', 'NV')
      .up()
      .ele('PostalCode', '89011')
      .up()
      .ele('Country', { isoCountryCode: 'US' }, 'US')
      .up()
      .ele('Email', email)
      .up()
      .up() // Close Address
      .up() // Close ShipTo
      .up() // Close OrderRequestHeader
      .up() // Close OrderRequest
      .up() // Close Request
      .end({ pretty: true });

    for (const lineItem of po.line_items) {
      const index = po.line_items.indexOf(lineItem);
      var builder = new xml2js.Builder({
        headless: true,
      });
      var xml = builder.buildObject({
        ItemOut: {
          ...lineItem.raw,
          $: {
            lineNumber: index + 1, // or lineItem.lineNumber if it's provided in lineItem
            ...(lineItem.raw as any).$,
          },
        },
      });

      // we need to insert the line items into the payload string from above into the right place

      payload = payload.replace('</OrderRequest>', `${xml}</OrderRequest>`);

      //
    }

    const response = await fetch( JSON.parse(creds).punchoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
      },
      body: payload,
    });

    if (!response.ok) {
      const errorResponse = await response.text();

      console.log('errorResponse', errorResponse);
      return errorResponse;
    }

    const data = await response.text();
    return payload;
  }

  public async saveCredentials(orgId: string, credentials: any): Promise<any> {
    if (!orgId) {
      throw new Error('Organization ID is required');
    }

    const encryptedCredentials = this.encryptService.encrypt(
      JSON.stringify(credentials),
    );

    console.log('orgId', orgId);

    const org = await this.organizationModel.findOne({ _id: orgId });

    if (!org) {
      throw new Error('Organization not found');
    }

    if (!org.settings) {
      org.settings = {} as OrgSettings;
    }

    console.log('credentials', credentials);
    console.log('encryptedCredentials', encryptedCredentials);

    org.settings.amzn_punchout = encryptedCredentials;

    const result = await this.organizationModel.updateOne(
      { _id: orgId },
      { $set: { 'settings.amzn_punchout': encryptedCredentials } },
    );

    return result;
  }

  public getCredentials = async (orgId, type = 'amzn_punchout') => {
    if (!orgId) {
      throw new Error('Organization ID is required');
    }

    const org = await this.organizationModel.findOne({ _id: orgId });

    if (!org) {
      throw new Error('Organization not found');
    }

    // switch on

    let encryptedCredentials;

    switch (type) {
      case 'amzn_punchout':
        encryptedCredentials = org.settings.amzn_punchout;
        break;
      default:
        throw new Error('Punchout credentials are missing');
    }

    if (!encryptedCredentials) {
      throw new Error('Punchout credentials are missing');
    }

    return this.encryptService.decrypt(encryptedCredentials);
  };

  // todo: We need to check if the person trying to change the status has the right permissions to do so
  public setStatus = async (poId: string, status: POStatus, user: string) => {
    return this.purchasingService.setStatus(poId, status, user);
  };
}
