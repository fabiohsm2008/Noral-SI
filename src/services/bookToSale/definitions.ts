import { IBook } from "../books/definitions";
import { ISale } from "../sales/definition";

export interface IBookToSale {
  id: number;
  quantity: number;
  specialPrice: number | null;
  active: boolean;
  book: IBook;
  sale: ISale;
}
