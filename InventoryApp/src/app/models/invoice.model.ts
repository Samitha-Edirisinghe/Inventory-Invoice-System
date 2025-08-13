import { Item } from './item.model';

export interface InvoiceItem {
  invoiceItemId?: number;
  invoiceId?: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  total: number;
  item?: Item;
}

export interface Invoice {
  invoiceId?: number;
  customerName: string;
  invoiceDate: Date;
  grandTotal: number;
  invoiceItems: InvoiceItem[];
}