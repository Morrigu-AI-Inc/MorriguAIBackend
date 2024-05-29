export class CreateLineitemDto {
  id: number;
  po_number: string;
  po_creation_date: string;
  supplier_name: string;
  supplier_contact_phone: string;
  supplier_contact_email: string;
  supplier_address1: string;
  supplier_address2: string;
  supplier_city: string;
  supplier_state: string;
  supplier_zip: string;
  supplier_country: string;
  status: string;
  product: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  raw: any;
  owner: string;
}
