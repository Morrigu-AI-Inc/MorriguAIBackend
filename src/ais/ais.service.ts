import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import * as WebSocket from 'ws';
import { PositionReportMessage, Vessel } from 'src/db/schemas/AIS';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportYetiShipment } from 'src/db/schemas/ImportYeti';
import cheerio, { load } from 'cheerio';

// export type PositionReportMessage = {
//   PositionReport: {
//     Cog: number;
//     CommunicationState: number;
//     Latitude: number;
//     Longitude: number;
//     MessageID: number;
//     NavigationalStatus: number;
//     PositionAccuracy: boolean;
//     Raim: boolean;
//     RateOfTurn: number;
//     RepeatIndicator: number;
//     Sog: number;
//     Spare: number;
//     SpecialManoeuvreIndicator: number;
//     Timestamp: number;
//     TrueHeading: number;
//     UserID: number;
//     Valid: boolean;
//   };
// };

// type PositionReportMeta = {
//   MMSI: number;
//   MMSI_String: string;
//   ShipName: string;
//   latitude: number;
//   longitude: number;
//   time_utc: string;
// };

const pipeLine = [
  {
    $match: {
      'shipment.hs_code': { $regex: '^080810' },
      'shipment.vessel_code': { $regex: '^[0-9]+$' },
    },
  },
  {
    $group: {
      _id: '$shipment.vessel_code',
      totalShipments: { $sum: 1 },
      vesselName: { $first: '$shipment.vessel_name' },
      vesselCountryCode: { $first: '$shipment.vessel_country_code' },
      lastVisitForeignPort: { $first: '$shipment.last_visit_foreign_port' },
    },
  },
  {
    $sort: {
      totalShipments: -1,
    },
  },
];

@Injectable()
export class AisService implements OnModuleInit {
  private readonly socket = new WebSocket(
    'wss://stream.aisstream.io/v0/stream',
  );
  private readonly API_KEY = 'f1b9756775a8cb2a8f2a90afbc87563c2c249d0e';
  private readonly logger = console;

  constructor(
    @InjectModel('Vessel')
    private vesselModel: Model<Vessel>,

    @InjectModel('ImportYetiShipment')
    private importYetiShipmentModel: Model<ImportYetiShipment>,
  ) {
    // this.socket = new WebSocket('wss://stream.aisstream.io/v0/stream');

    // this.socket.addEventListener('open', () => {
    //   console.log('WebSocket connection established.');
    //   const subscriptionMessage = {
    //     APIkey: this.API_KEY,
    //     FilterMessageType: ['PositionReport'],
    //     BoundingBoxes: [
    //       [
    //         [-180, -90],
    //         [180, 90],
    //       ],
    //     ],
    //   };
    //   this.socket.send(JSON.stringify(subscriptionMessage));
    //   this.logger.log(
    //     'WebSocket connection established and subscription sent.',
    //   );

    //   this.socket.addEventListener('error', (event) => {
    //     this.logger.error(`WebSocket error: ${event}`);
    //   });

    //   this.socket.addEventListener('message', (event) => {
    //     // this.handleMessage(event.data as string);
    //   });
    // });
  }

  onModuleInit() {}

  private async handleMessage(data: string) {
    const aisMessage: Vessel = JSON.parse(data);

    // console.log('Meta Data', aisMessage['MetaData']);

    if (aisMessage['MessageType'] === 'PositionReport') {
      // find first
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.PositionReport': aisMessage['Message']['PositionReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'BaseStationReport') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.BaseStationReport':
              aisMessage['Message']['BaseStationReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'MultiSlotBinaryMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.MultiSlotBinaryMessage':
              aisMessage['Message']['MultiSlotBinaryMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'ExtendedClassBPositionReport') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.ExtendedClassBPositionReport':
              aisMessage['Message']['ExtendedClassBPositionReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'SafetyBroadcastMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.SafetyBroadcastMessage':
              aisMessage['Message']['SafetyBroadcastMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'StaticDataReport') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.StaticDataReport':
              aisMessage['Message']['StaticDataReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'StandardClassBPositionReport') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.StandardClassBPositionReport':
              aisMessage['Message']['StandardClassBPositionReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (
      aisMessage['!MessageType'] === 'StandardSearchAndRescueAircraftReport'
    ) {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.StandardSearchAndRescueAircraftReport':
              aisMessage['Message']['StandardSearchAndRescueAircraftReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'SingleSlotBinaryMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.SingleSlotBinaryMessage':
              aisMessage['Message']['SingleSlotBinaryMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'Interrogation') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.Interrogation': aisMessage['Message']['Interrogation'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'LongRangeAisBroadcastMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.LongRangeAisBroadcastMessage':
              aisMessage['Message']['LongRangeAisBroadcastMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'GnssBroadcastBinaryMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.GnssBroadcastBinaryMessage':
              aisMessage['Message']['GnssBroadcastBinaryMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'DataLinkManagementMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.DataLinkManagementMessage':
              aisMessage['Message']['DataLinkManagementMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'AddressedSafetyMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.AddressedSafetyMessage':
              aisMessage['Message']['AddressedSafetyMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'AddressedBinaryMessage') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.AddressedBinaryMessage':
              aisMessage['Message']['AddressedBinaryMessage'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'CoordinatedUTCInquiry') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.CoordinatedUTCInquiry':
              aisMessage['Message']['CoordinatedUTCInquiry'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'BinaryAcknowledge') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.BinaryAcknowledge':
              aisMessage['Message']['BinaryAcknowledge'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'ChannelManagement') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.ChannelManagement':
              aisMessage['Message']['ChannelManagement'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'AssignedModeCommand') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.AssignedModeCommand':
              aisMessage['Message']['AssignedModeCommand'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    } else if (aisMessage['!MessageType'] === 'AidsToNavigationReport') {
      await this.vesselModel.findOneAndUpdate(
        {
          'MetaData.MMSI': aisMessage['MetaData']['MMSI'],
        },
        {
          $set: {
            'Message.AidsToNavigationReport':
              aisMessage['Message']['AidsToNavigationReport'],
            // MessageType: aisMessage['MessageType'],
            MetaData: aisMessage['MetaData'],
          },
        },
        { upsert: true, new: true },
      );
    }
  }

  async getVesselByMMSI(mmsi: number) {
    return this.vesselModel.findOne({ 'MetaData.MMSI': mmsi });
  }

  async getVesselsByBoundingBox({ X1, X2, Y1, Y2 }) {
    return this.vesselModel.find({
      'Message.PositionReport.Longitude': { $gte: X1, $lte: X2 },
      'Message.PositionReport.Latitude': { $gte: Y1, $lte: Y2 },
    });
  }

  getTopVessels(hscode: string) {
    console.log('getTopVessels');
    return this.importYetiShipmentModel.aggregate(pipeLine as any);
  }

  fetchVesselDetails = async (url) => {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);

      // Extract vessel name
      const vesselName = $('h1.title').text().trim();

      // Extract vessel type and IMO
      const vesselTypeAndIMO = $('h2.vst').text().trim();

      // Extract current position
      const currentPosition = $('.text2 strong:first-of-type').text().trim();

      // Extract destination
      const destination = $('.text2 strong:nth-of-type(2)').text().trim();

      // Extract ETA
      const eta = $('.text2 strong:nth-of-type(3)').text().trim();

      // Extract MMSI
      const mmsi = $('.v3np').text().trim();
      const imo = mmsi.split('/')[0].trim();

      // Extract Callsign
      const callsign = $('.v3:eq(6)').text().trim();

      // Extract Flag
      const flag = $('.v3:eq(7)').text().trim();

      // Extract Length/Beam
      const lengthBeam = $('.v3:eq(8)').text().trim();

      // Extract Navigation Status
      const navigationStatus = $('.ttt0').text().trim();

      // Extract Position Received
      const positionReceived = $('#lastrep').text().trim();

      // Extract Recent Port Calls
      const recentPortCalls = $('#port-calls .vhc2')
        .map((i, el) => $(el).text().trim())
        .get();

      // Extract Ship Photo URL
      const photoUrl = $('.img-holder img.main-photo').attr('src');

      // Extract Vessel Particulars
      const vesselParticulars = {};
      $('.tpt1 tbody tr').each((i, el) => {
        const key = $(el).find('.tpc1').text().trim();
        const value = $(el).find('.tpc2').text().trim();
        vesselParticulars[key] = value;
      });

      // Extract Management Details
      const managementDetails = {};
      $('.tptfix tbody tr').each((i, el) => {
        const key = $(el).find('.tpc1').text().trim();
        const value = $(el).find('.tpc2').text().trim();
        managementDetails[key] = value;
      });

      // Return the extracted data
      return {
        vesselName,
        vesselTypeAndIMO,
        currentPosition,
        destination,
        eta,
        mmsi,
        imo,
        callsign,
        flag,
        lengthBeam,
        navigationStatus,
        positionReceived,
        recentPortCalls,
        photoUrl,
        vesselParticulars,
        managementDetails,
      };
    } catch (error) {
      console.error('Error fetching vessel details:', error);
    }
  };
  scrapeVesselFinderByMMSI(mmsi: number) {
    const url = `https://www.vesselfinder.com/vessels/details/${mmsi}`;

    // use fetch and cheerio to scrape the vessel finder page
    return this.fetchVesselDetails(url);
  }
}
