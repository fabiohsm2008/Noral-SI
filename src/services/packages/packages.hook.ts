import axios from "axios";
import { reverse, sortBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "config/constants";
import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { IPackage } from "./definitions";
import { IBook } from "services/books/definitions";

function convertBackendPack(backendPackage: PackFromBackend): IPackage {
  return {
    id: Number(backendPackage.id),
    level: backendPackage.level,
    grade: backendPackage.grade,
    active: backendPackage.active,
    school: backendPackage.school,
    books: backendPackage.books,
  };
}

interface PackFromBackend {
  id: number;
  level: string;
  active: boolean;
  grade: number;
  school: string;
  books: IBook[];
}

interface PackToBackend {
  id: number;
  level: string;
  active: boolean;
  grade: number;
  school: string;
  books: IBook[];
}

type AllPacksResponse = {
  message: string;
  data: PackFromBackend[];
};

type OnePackResponse = {
  message: string;
  data: PackFromBackend;
};

type PackBook = {
  idPack: number;
  idBook: number;
};

type Props = {
  id?: string;
};

// todo: change to request to package
export function usePacks({ id = "" }: Props = {}) {
  const queryClient = useQueryClient();

  const allPacksQuery = useQuery(
    "packs",
    () => axios.get<AllPacksResponse>(`${baseUrl}packs/`),
    { enabled: !id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const onePackQuery = useQuery(
    "pack",
    () => axios.get<OnePackResponse>(`${baseUrl}packs/${id}`),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const createPackMutation = useMutation((newPack: PackToBackend) =>
    axios.post(`${baseUrl}packs/`, {
      ...newPack,
      books: JSON.stringify(newPack.books.map((b) => b.id)),
    })
  );

  const addBook = useMutation((data: PackBook) =>
    axios.post(`${baseUrl}packs/${data.idPack}/${data.idBook}`)
  );

  const removeAllBooks = useMutation((idPack: number) =>
    axios.delete(`${baseUrl}packs/removeBooks/${idPack}`)
  );

  const editPackMutation = useMutation(
    (packToEdit: PackToBackend & { id: number }) =>
      axios.put(`${baseUrl}packs/${packToEdit.id}`, packToEdit)
  );

  const deletePackMutation = useMutation(
    (packToDelete: string) => axios.delete(`${baseUrl}packs/${packToDelete}`),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries("packs");
      },
    }
  );

  const packs: IPackage[] | undefined =
    allPacksQuery.data?.data?.data?.map(convertBackendPack);

  const backendPack = onePackQuery.data?.data.data;
  const pack: IPackage | undefined =
    backendPack && convertBackendPack(backendPack);

  const paginatedPacks =
    ({ active }: { active: boolean }) =>
    (
      pageIndex: number,
      pageSize: number,
      sortField: keyof IPackage,
      sortDirection: Direction
    ) => {
      const sortedPacksAsc = sortBy(packs, [sortField]);
      const sortedPacks =
        sortDirection === "asc" ? sortedPacksAsc : reverse(sortedPacksAsc);

      const activePacks = sortedPacks.filter((p) =>
        active ? p.active : !p.active
      );
      const paginatedPacks = activePacks.slice(pageIndex, pageIndex + pageSize);
      return {
        pageOfItems: paginatedPacks,
        totalItemCount: packs?.length ?? 0,
      };
    };

  return {
    paginatedPacks,
    pack,
    packs,
    onePackQuery,
    createPackMutation,
    editPackMutation,
    deletePackMutation,
    addBook,
    removeAllBooks,
  };
}
