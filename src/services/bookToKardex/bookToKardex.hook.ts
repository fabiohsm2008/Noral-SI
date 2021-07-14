import axios from "axios";
import { reverse, sortBy } from "lodash";
import { useQuery } from "react-query";
// useQueryClient, useMutation
import { baseUrl } from "config/constants";
import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { IBookToKardex } from "./definitions";

import { IKardex } from "services/kardex/definitions";

import { IBook } from "services/books/definitions";

function convertBackendBookToKardex(
  backendBookToKardex: BookToKardexFromBackend
): IBookToKardex {
  return {
    id: Number(backendBookToKardex.id),
    quantity: backendBookToKardex.quantity,
    active: backendBookToKardex.active,
    book: backendBookToKardex.book,
    kardex: backendBookToKardex.kardex,
  };
}

export interface BookToKardexFromBackend {
  id: number;
  quantity: number;
  active: string;
  book: IBook;
  kardex: IKardex;
}

// interface BookToKardexToBackend {
//   id: number;
//   quantity: number;
//   active: string;
//   book: IBook;
//   kardex: IKardex;
// }

type AllBookToKardexResponse = {
  message: string;
  data: IBookToKardex[];
};

type OneBookToKardexResponse = {
  message: string;
  data: IBookToKardex;
};

type Props = {
  id?: string;
};

// todo: change to request to kardex
export function useBookToKardex({ id = "" }: Props = {}) {
  // const queryClient = useQueryClient();

  const allBookToKardexsQuery = useQuery(
    "bookToKardexs",
    () => axios.get<AllBookToKardexResponse>(`${baseUrl}bookToKardex/`),
    { enabled: !id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const oneBookToKardexQuery = useQuery(
    "bookToKardex",
    () => axios.get<OneBookToKardexResponse>(`${baseUrl}bookToKardex/${id}`),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  // const createKardexMutation = useMutation((newKardex: BookToKardexToBackend) =>
  //   axios.post(`${baseUrl}kardex/`, {
  //     ...newKardex,
  //     books: JSON.stringify(newKardex.books.map((b) => b.id)),
  //   })
  // );

  // const deleteKardexMutation = useMutation(
  //   (KardexToDelete: string) =>
  //     axios.delete(`${baseUrl}kardex/${KardexToDelete}`),
  //   {
  //     onSuccess: () => {
  //       void queryClient.invalidateQueries("kardex");
  //     },
  //   }
  // );

  const AllBookToKardexs: IBookToKardex[] =
    allBookToKardexsQuery.data?.data?.data?.map(convertBackendBookToKardex) ??
    [];

  const backendBookToKardex = oneBookToKardexQuery.data?.data.data;
  const BookToKardex: IBookToKardex | undefined =
    backendBookToKardex && convertBackendBookToKardex(backendBookToKardex);

  const paginatedBookToKardex = (
    pageIndex: number,
    pageSize: number,
    sortField: keyof IBookToKardex,
    sortDirection: Direction
  ) => {
    const sortedBookToKardexsAsc = sortBy(AllBookToKardexs, [sortField]);
    const sortedBookToKardexs =
      sortDirection === "asc"
        ? sortedBookToKardexsAsc
        : reverse(sortedBookToKardexsAsc);

    const paginatedKardex = sortedBookToKardexs.slice(
      pageIndex,
      pageIndex + pageSize
    );
    return {
      pageOfItems: paginatedKardex,
      totalItemCount: AllBookToKardexs?.length ?? 0,
    };
  };

  return {
    paginatedBookToKardex,
    BookToKardex,
    oneBookToKardexQuery,
    AllBookToKardexs,
    // createKardexMutation,
    // deleteKardexMutation,
  };
}
