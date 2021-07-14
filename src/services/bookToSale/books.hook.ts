import axios from "axios";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { baseUrl } from "config/constants";
import { IBookToSale } from "./definitions";
import { ISaleBackend } from "../sales/definition";
import { BookFromBackend, convertBackendBook } from "../books/books.hook";
import { convertBackendSale } from "../sales/sale.hooks";

const convertBackendBookToSale = (
  backendBookToSale: BookToSaleFromBackend
): IBookToSale => ({
  ...backendBookToSale,
  book: convertBackendBook(backendBookToSale.book),
  sale: convertBackendSale(backendBookToSale.sale),
});

interface BookToSaleFromBackend {
  id: number;
  quantity: number;
  specialPrice: number | null;
  active: boolean;
  book: BookFromBackend;
  sale: ISaleBackend;
}

type AllBooksResponse = {
  message: string;
  data: BookToSaleFromBackend[];
};

export function useBooksToSale() {
  const allBooksQuery = useQuery(
    "booksToSales",
    () => axios.get<AllBooksResponse>(`${baseUrl}bookToSales`),
    { enabled: true, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const booksToSales: IBookToSale[] | undefined = useMemo(() => {
    return allBooksQuery.data?.data?.data?.map(convertBackendBookToSale);
  }, [allBooksQuery]);

  return {
    booksToSales,
  };
}
