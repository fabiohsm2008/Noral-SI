import { IBook } from "services/books/definitions";
import { IKardex } from "services/kardex/definitions";

export interface IBookToKardex {
  id: number;
  quantity: number;
  active: string;
  book: IBook;
  kardex: IKardex;
}
