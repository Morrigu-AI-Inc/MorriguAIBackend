export class CreatePurchasingDto {
    readonly supplier: string; // Supplier ID
    readonly rawMaterials: string[]; // Array of raw material IDs
    readonly orderDate: Date;
    readonly deliveryDate: Date;
    readonly totalAmount: number;
    readonly status: string;
  }
  