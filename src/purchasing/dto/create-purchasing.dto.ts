// {
//       // Random values for now
//       poNumber: v4(),
//       poDate: new Date().toISOString(),
//       supplier: {
//         _id: '',
//         name: '',
//         description: '',
//         contactInfo_phone: '',
//         contactInfo_email: '',
//         address1: '',
//         address2: '',
//         city: '',
//         state: '',
//         zip: '',
//         country: '',
//         latitude: 0,
//         longitude: 0,
//         products: []
//       },
//       shippingAddress: {
//         _id: '',
//         owner: '',
//         name: 'John Doe',
//         street: '123 Main St',
//         street2: 'Apt 1',
//         city: 'Washington',
//         state: 'DC',
//         zip: '12345',
//         country: 'USA'
//       },
//       billingAddress: {
//         _id: '',
//         owner: '',
//         name: 'John Doe',
//         street: '123 Main St',
//         street2: 'Apt 1',
//         city: 'Washington',
//         state: 'DC',
//         zip: '12345',
//         country: 'USA'
//       },
//       isEditing: false,
//       items: items
//     }

import { AddressDocument, Organization } from 'src/db/schemas';
import { SupplierDocument } from 'src/db/schemas/Supplier';

export class CreatePurchasingDto {
  readonly supplier: SupplierDocument;
  readonly shippingAddress: AddressDocument;
  readonly billingAddress: AddressDocument;
  readonly items: {
    item: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  poNumber: string;
  poDate: string;
  owner: Organization;
}
