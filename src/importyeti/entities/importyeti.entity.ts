export type Geocode = {
  lat: number;
  lon: number;
};

export type AddressComponents = {
  country?: string;
  city?: string;
  county?: string;
  state?: string;
  zip?: string;
  formatted_street?: string;
  number?: string;
  street?: string;
  suffix?: string;
  predirectional?: string;
};

export type AddressGeocode = {
  address_components?: AddressComponents;
  formatted_address?: string;
  location: Geocode;
};

export type ContainerTypeInfo = {
  desc: string;
  group: string;
  length: string;
  type: string;
  width_x_height: string;
};

export type Container = {
  description: string;
  id: string;
  load_status: string;
  load_status_info: string;
  mark: string | null;
  service_type: string;
  service_type_info: string;
  size: string;
  type: string;
  type_info: ContainerTypeInfo;
};

export type ContainerType = {
  type: string;
  length: string;
  width_x_height: string;
  group: string;
  count: number;
  desc: string;
};

export type ShippingRate = {
  route: string;
  ticker: string | null;
  value: number | null;
};

export type Shipment = {
  index: boolean;
  bol_number: string;
  bol_bill_type: string;
  master_bol_number: string;
  arrival_date: string;
  port_of_entry_geocode: Geocode;
  shipping_port_geocode?: Geocode;
  company_name: string;
  company_basename: string;
  company_address: string;
  containers: Container[];
  supplier_address_geocode: AddressGeocode;
  company_address_geocode: AddressGeocode;
  company_link: string;
  company_country: string;
  company_country_code: string;
  company_total_shipments: number;
  company_main_phone_number: string | null;
  company_contact_info_exists: boolean;
  company_website: string | null;
  port_of_entry: string;
  port_of_entry_code: string;
  supplier_name: string;
  supplier_basename: string;
  supplier_address: string;
  supplier_link: string;
  supplier_country: string;
  supplier_country_code: string;
  supplier_total_shipments: number;
  supplier_main_phone_number: string | null;
  supplier_contact_info_exists: boolean;
  'marks_&_numbers': string;
  'marks_&_numbers_raw': string;
  supplier_website: string | null;
  shipping_port: string | null;
  shipping_port_code: string;
  hs_code: string;
  hs_code_link: string;
  hs_code_description: string | null;
  full_hs_code_description: string | null;
  product_description: string;
  product_description_raw: string;
  carrier_scac_code: string;
  vessel_code: string;
  vessel_country_code: string;
  vessel_name: string;
  last_visit_foreign_port: string;
  estimated_arrival_date: string;
  teu: string;
  quantity: string;
  quantity_unit: string;
  weight: number;
  notify_party_name: string | null;
  notify_party_address: string | null;
  notify_party_address_geocode: AddressGeocode | {};
  notify_party_country_code: string | null;
  container_types: ContainerType[];
  container_desc_code: string;
  internal_supplier: boolean;
  voyage: string;
  alibaba_link: boolean;
  shipping_cost: number | null;
  shipping_rate: ShippingRate;
  place_of_receipt: string;
};

export type ShipmentsArray = Shipment[];

export class Importyeti {}
