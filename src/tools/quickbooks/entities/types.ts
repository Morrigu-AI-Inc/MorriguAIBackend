export namespace QuickBooks {
  export interface Email {
    Address: string;
  }

  export interface Reference {
    name: string;
    value: string;
  }

  export interface Address {
    Line1: string;
    Line2: string;
    Line3: string;
    Line4: string;
    Id: string;
  }

  export interface ItemRef {
    name: string;
    value: string;
  }

  export interface CustomerRef {
    name: string;
    value: string;
  }

  export interface TaxCodeRef {
    value: string;
  }

  export interface ItemBasedExpenseLineDetail {
    ItemRef: ItemRef;
    CustomerRef: CustomerRef;
    Qty: number;
    TaxCodeRef: TaxCodeRef;
    BillableStatus: string;
    UnitPrice: number;
  }

  export interface LineDetail {
    DetailType: string;
    Amount: number;
    ProjectRef: Reference;
    Id: string;
    ItemBasedExpenseLineDetail: ItemBasedExpenseLineDetail;
  }

  export interface CustomField {
    DefinitionId: string;
    Type: string;
    Name: string;
  }

  export interface MetaData {
    CreateTime: string;
    LastUpdatedTime: string;
  }

  export interface PurchaseOrder {
    DocNumber: string;
    SyncToken: string;
    POEmail: Email;
    APAccountRef: Reference;
    CurrencyRef: Reference;
    TxnDate: string;
    TotalAmt: number;
    ShipAddr: Address;
    domain: string;
    Id: string;
    POStatus: string;
    sparse: boolean;
    EmailStatus: string;
    VendorRef: Reference;
    Line: LineDetail[];
    CustomField: CustomField[];
    VendorAddr: Address;
    MetaData: MetaData;
  }

  export interface RootObject {
    PurchaseOrder: PurchaseOrder;
    time: string;
  }
}
