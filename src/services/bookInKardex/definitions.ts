import { IBook } from "services/books/definitions";

export interface bookInKardex {
  id: number;
  kardexId: number;
  quantity: number;
  book: IBook;
}

export interface IBookInKardex {
  id: number;
  documentId: string;
  documentType: string;
  kardexType: string;
  date: Date;
  documentImage: string;
  books: bookInKardex[];
}
