export class CreateRawmaterialDto {
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly unit: string; // e.g., kilograms, liters, etc.
    readonly costPerUnit: number;
    readonly suppliers: string[]; // Array of supplier IDs
  }
  