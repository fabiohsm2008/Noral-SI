import axios from "axios";
import { reverse, sortBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "config/constants";
import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { IKardex } from "./definitions";
// import { IBook } from "services/books/definitions";

function convertBackendKardex(backendKardex: KardexFromBackend): IKardex {
  return {
    id: Number(backendKardex.id),
    documentId: backendKardex.documentId,
    documentType: backendKardex.documentType,
    kardexType: backendKardex.kardexType,
    date: backendKardex.date,
    documentImage: backendKardex.documentImage,
  };
}
export interface KardexFromBackend {
  id: number;
  documentId: string;
  documentType: string;
  kardexType: string;
  date: Date;
  documentImage: string;
}

type AllKardexsResponse = {
  message: string;
  data: KardexFromBackend[];
};

type OneKardexResponse = {
  message: string;
  data: KardexFromBackend;
};

type Props = {
  id?: string;
};

// todo: change to request to kardex
export function useKardex({ id = "" }: Props = {}) {
  const queryClient = useQueryClient();

  const allKardexsQuery = useQuery(
    "Kardexs",
    () => axios.get<AllKardexsResponse>(`${baseUrl}kardex/`),
    { enabled: !id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const oneKardexQuery = useQuery(
    "Kardex",
    () => axios.get<OneKardexResponse>(`${baseUrl}kardex/${id}`),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const deleteKardexMutation = useMutation(
    (KardexToDelete: string) =>
      axios.delete(`${baseUrl}kardex/${KardexToDelete}`),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries("kardex");
      },
    }
  );

  const Kardexs: IKardex[] =
    allKardexsQuery.data?.data?.data?.map(convertBackendKardex) ?? [];

  const backendKardex = oneKardexQuery.data?.data.data;
  const Kardex: IKardex | undefined =
    backendKardex && convertBackendKardex(backendKardex);

  const paginatedKardex = (
    pageIndex: number,
    pageSize: number,
    sortField: keyof IKardex,
    sortDirection: Direction
  ) => {
    const sortedKardexsAsc = sortBy(Kardexs, [sortField]);
    const sortedKardexs =
      sortDirection === "asc" ? sortedKardexsAsc : reverse(sortedKardexsAsc);

    const paginatedKardex = sortedKardexs.slice(
      pageIndex,
      pageIndex + pageSize
    );
    return {
      pageOfItems: paginatedKardex,
      totalItemCount: Kardexs?.length ?? 0,
    };
  };

  return {
    paginatedKardex,
    oneKardexQuery,
    Kardex,
    Kardexs,
    deleteKardexMutation,
  };
}
