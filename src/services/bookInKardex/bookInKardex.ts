import axios from "axios";

import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { reverse, sortBy } from "lodash";
import { useMutation } from "react-query";

import { IBookInKardex, bookInKardex } from "./definitions";

import { useBookToKardex } from "services/bookToKardex/bookToKardex.hook";
import { useKardex } from "services/kardex/kardex.hook";
import { IBookToKardex } from "services/bookToKardex/definitions";
import { IKardex } from "services/kardex/definitions";
import { IBook } from "services/books/definitions";

import { baseUrl } from "config/constants";

export function setBookInKardexs(
  kardexs: IKardex[],
  allBooksToKardex: IBookToKardex[]
): IBookInKardex[] {
  return kardexs.map((kardex) => {
    return {
      id: Number(kardex.id),
      documentId: kardex.documentId,
      documentType: kardex.documentType,
      kardexType: kardex.kardexType,
      date: kardex.date,
      documentImage: kardex.documentImage,
      books: allBooksToKardex
        .filter((k) => k.kardex.id === kardex.id)
        .map((bK) => {
          return {
            id: bK.id,
            kardexId: bK.kardex.id,
            quantity: bK.quantity,
            book: bK.book,
          } as bookInKardex;
        }),
    };
  });
}
export interface BookQuantityToBackEnd {
  id: number;
  quantity: number;
}

export interface bookInKardexToBackend {
  quantity: number;
  book: IBook;
}

export interface IBookInKardexToBackend {
  id: number;
  documentId: string;
  documentType: string;
  kardexType: string;
  date: Date;
  documentImage: string;
  books: bookInKardexToBackend[];
}

type Props = {
  id?: string;
};

export function useBookInKardex({ id = "" }: Props = {}) {
  const { Kardexs } = useKardex();
  const { AllBookToKardexs } = useBookToKardex();

  const BookInKardex = setBookInKardexs(Kardexs, AllBookToKardexs);

  const getBookInKardex = (id: number) => {
    return BookInKardex.find((bk) => bk.id === id);
  };

  const createKardexMutation = useMutation(
    (newKardex: IBookInKardexToBackend) =>
      axios.post(`${baseUrl}kardex/`, {
        ...newKardex,
        books: JSON.stringify(
          newKardex.books.map((kb) => {
            return {
              id: kb.book.id,
              quantity: kb.quantity,
            };
          })
        ),
      })
  );

  const paginatedBookInKardex =
    ({ active }: { active: boolean }) =>
    (
      pageIndex: number,
      pageSize: number,
      sortField: keyof IBookInKardex,
      sortDirection: Direction
    ) => {
      const sortedBookInKardexsAsc = sortBy(BookInKardex, [sortField]);
      const sortedBookToKardexs =
        sortDirection === "asc"
          ? sortedBookInKardexsAsc
          : reverse(sortedBookInKardexsAsc);

      const paginatedKardex = sortedBookToKardexs.slice(
        pageIndex,
        pageIndex + pageSize
      );
      return {
        pageOfItems: paginatedKardex,
        totalItemCount: BookInKardex?.length ?? 0,
      };
    };

  return {
    paginatedBookInKardex,
    BookInKardex,
    getBookInKardex,
    createKardexMutation,
  };
}
