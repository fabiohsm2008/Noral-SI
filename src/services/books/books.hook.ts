import axios from "axios";
import { reverse, sortBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "config/constants";
import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { IBook } from "./definitions";
import { useMemo } from "react";

export const convertBackendBook = (backendBook: BookFromBackend): IBook => ({
  ...backendBook,
  id: Number(backendBook.id),
  grade: Number(backendBook.grade),
  price: Number(backendBook.price),
});

export interface BookFromBackend {
  id: string;
  title: string;
  price: string | null;
  cover: string | null;
  level: string | null;
  grade: string | null;
  editorial: string | null;
  created_at: string;
  updated_at: string;
  active: boolean;
  stock: number;
}

interface BookToBackend {
  title: string;
  price?: string;
  cover?: string;
  level?: string;
  grade?: string;
}

type AllBooksResponse = {
  message: string;
  data: BookFromBackend[];
};

type OneBookResponse = {
  message: string;
  data: BookFromBackend;
};

type Props = {
  id?: string;
};

export function useBooks({ id = "" }: Props = {}) {
  const queryClient = useQueryClient();

  const allBooksQuery = useQuery(
    "books",
    () => axios.get<AllBooksResponse>(`${baseUrl}books`),
    { enabled: !id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const oneBooksQuery = useQuery(
    "book",
    () => axios.get<OneBookResponse>(`${baseUrl}books/${id}`),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const createBookMutation = useMutation((newBook: BookToBackend) =>
    axios.post(`${baseUrl}books`, newBook)
  );

  const editBookMutation = useMutation(
    (bookToEdit: BookToBackend & { id: string }) =>
      axios.put(`${baseUrl}books/${bookToEdit.id}`, bookToEdit)
  );

  const deleteBookMutation = useMutation(
    (bookToDelete: string) => axios.delete(`${baseUrl}books/${bookToDelete}`),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries("books");
      },
    }
  );

  const books: IBook[] | undefined = useMemo(() => {
    return allBooksQuery.data?.data?.data?.map(convertBackendBook);
  }, [allBooksQuery]);

  const backendBook = oneBooksQuery.data?.data.data;
  const book: IBook | undefined =
    backendBook && convertBackendBook(backendBook);

  const paginatedBooks =
    ({ active }: { active: boolean }) =>
    (
      pageIndex: number,
      pageSize: number,
      sortField: keyof IBook,
      sortDirection: Direction
    ) => {
      const sortedBooksAsc = sortBy(books, [sortField]);
      const sortedBooks =
        sortDirection === "asc" ? sortedBooksAsc : reverse(sortedBooksAsc);

      const activeBooks = sortedBooks.filter((books) =>
        active ? books.active : !books.active
      );

      const paginatedBooks = activeBooks.slice(pageIndex, pageIndex + pageSize);

      return {
        pageOfItems: paginatedBooks,
        totalItemCount: books?.length ?? 0,
      };
    };

  return {
    paginatedBooks,
    book,
    books,
    createBookMutation,
    editBookMutation,
    deleteBookMutation,
  };
}
