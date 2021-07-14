export interface IBook {
  id: number;
  title: string; // todo: to delete when sending to backend
  quantity: number;
  // editorial: string;
  price?: number;
  // cover?: string;
  // level?: string;
  // grade?: number;
  // stock: number;
}

export interface IBooks {
  id: number;
  title: string;
  editorial: string;
  price: number;
  cover?: string;
  level?: string;
  grade?: number;
  stock: number;
}

export interface IPackage {
  id: number;
  level: string;
  grade: number;
  active: boolean;
  school: string;
  books: IBooks[];
  quantity: number;
}

export interface ICustomer {
  email: string;
}

export interface ISaleBackend {
  id: string;
  documentId: string;
  documentType: DocumentType;
  paymentType: PaymentType;
  clientType: ClientType;
  books?: IBook[];
  DNI?: string;
  RUC?: string;
  name?: string;
  email?: string;
  active?: boolean;
  customer?: ICustomer[];
  school: string;
}

export interface ISale extends Omit<ISaleBackend, "id" | "books"> {
  id: number;
  books: IBook[];
}

export type DocumentType = "BOLETA" | "FACTURA";
export type PaymentType = "CASH" | "CARD";
export type ClientType = "CLIENT" | "BUSINESS";
