import axios from "axios";
import { reverse, sortBy, sum } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "config/constants";

import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { ISaleBackend, ISale } from "./definition";
import { useBooksToSale } from "../bookToSale/books.hook";

export function convertBackendSale(backendSale: ISaleBackend): ISale {
  return {
    ...backendSale,
    id: Number(backendSale.id),
    books: backendSale.books,
  };
}

interface SaleToBackend extends Omit<ISaleBackend, "id"> {}

type AllSalesResponse = {
  message: string;
  data: ISaleBackend[];
};

type OneSaleResponse = {
  message: string;
  data: ISaleBackend;
};

type Props = {
  id?: string;
};

export function useSales({ id = "" }: Props = {}) {
  const queryClient = useQueryClient();

  const allSalesQuery = useQuery(
    "sales",
    () => axios.get<AllSalesResponse>(`${baseUrl}sales`),
    { enabled: !id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const oneUserQuery = useQuery(
    "sale",
    () => axios.get<OneSaleResponse>(`${baseUrl}sales/${id}`),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const createSaleMutation = useMutation((newSale: SaleToBackend) =>
    axios.post(`${baseUrl}sales`, {
      ...newSale,
      books: JSON.stringify(
        newSale.books.map((sales) => {
          const sale = {
            id: sales.id,
            quantity: sales.quantity,
          };
          return sale;
        })
      ),
    })
  );

  const deleteSaleMutation = useMutation(
    (saleIdToDelete: string) =>
      axios.delete(`${baseUrl}sales/${saleIdToDelete}`),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries("sales");
      },
    }
  );

  const sales: ISale[] | undefined =
    allSalesQuery.data?.data?.data?.map(convertBackendSale);

  const backendUser = oneUserQuery.data?.data.data;
  const sale: ISale | undefined =
    backendUser && convertBackendSale(backendUser);

  const { booksToSales } = useBooksToSale();

  const paginatedSales =
    ({ active }: { active: boolean }) =>
    (
      pageIndex: number,
      pageSize: number,
      sortField: keyof ISaleBackend,
      sortDirection: Direction
    ) => {
      const sortedSalesAsc = sortBy(sales, [sortField]);
      const sortedSales =
        sortDirection === "asc" ? sortedSalesAsc : reverse(sortedSalesAsc);

      const activeSales = sortedSales.filter((sale) =>
        active ? sale.active : !sale.active
      );
      const paginatedSales = activeSales.slice(pageIndex, pageIndex + pageSize);

      const paginatedSalesWithSales = paginatedSales?.map((sale) => {
        const bookToSalesById = booksToSales?.filter(
          (bookToSale) => bookToSale.sale.id === sale.id
        );

        return {
          ...sale,
          amount: sum(
            bookToSalesById?.map((bookToSale) => bookToSale.book.price / 100)
          ),
        };
      });
      return {
        pageOfItems: paginatedSalesWithSales,
        totalItemCount: sales?.length ?? 0,
      };
    };

  return {
    paginatedSales,
    sale,
    createSaleMutation,
    deleteSaleMutation,
  };
}
