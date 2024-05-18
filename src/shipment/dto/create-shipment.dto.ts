export class CreateShipmentDto {
    readonly purchaseOrder: string; // PurchaseOrder ID
    readonly shipmentDate: Date;
    readonly carrier: string;
    readonly trackingNumber: string;
    readonly status: string;
    readonly address: string;
    readonly latitude: number;
    readonly longitude: number;
  }
  