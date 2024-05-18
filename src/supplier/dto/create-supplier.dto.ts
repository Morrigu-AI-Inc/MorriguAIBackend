export class CreateSupplierDto {
  readonly name: string;
  readonly contactInfo: string;
  readonly address: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly rawMaterials: string[]; // Array of raw material IDs
  readonly organization: string; // Organization ID
}
