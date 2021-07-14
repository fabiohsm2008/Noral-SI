import { IBook } from "services/books/definitions";

export interface IPackage {
  id: number;
  level: string;
  grade: number;
  active: boolean;
  school: string;
  books: IBook[];
}
