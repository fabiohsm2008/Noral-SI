import axios from "axios";
import { reverse, sortBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { baseUrl } from "config/constants";

import { Direction } from "@elastic/eui/src/services/sort/sort_direction";

import { IUser } from "./definitions";
import { Rol } from "../../pages/Users/components/UserForm";

function convertBackendUser(backendUser: UserFromBackend): IUser {
  return {
    ...backendUser,
    id: Number(backendUser.id),
    password: "",
  };
}

interface UserFromBackend {
  id: number;
  email: string;
  name: string;
  role: Rol;
  dni: string;
  password: string;
  active: boolean;
}

interface UserToBackend {
  email: string;
  name: string;
  role: string;
  dni: string;
  password: string;
}

type AllUsersResponse = {
  message: string;
  data: UserFromBackend[];
};

type OneUserResponse = {
  message: string;
  data: UserFromBackend;
};

type Props = {
  id?: string;
};

export function useUsers({ id = "" }: Props = {}) {
  const queryClient = useQueryClient();

  const allUsersQuery = useQuery(
    "users",
    () => axios.get<AllUsersResponse>(`${baseUrl}users`),
    { enabled: !id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const oneUserQuery = useQuery(
    "user",
    () => axios.get<OneUserResponse>(`${baseUrl}users/${id}`),
    { enabled: !!id, refetchOnWindowFocus: false, refetchOnMount: false }
  );

  const createUserMutation = useMutation((newUser: UserToBackend) =>
    axios.post(`${baseUrl}users`, newUser)
  );

  const editUserMutation = useMutation(
    (userToEdit: UserToBackend & { id: string }) =>
      axios.put(`${baseUrl}users/${userToEdit.id}`, userToEdit)
  );

  const deleteUserMutation = useMutation(
    (userToDelete: string) => axios.delete(`${baseUrl}users/${userToDelete}`),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries("users");
      },
    }
  );

  const users: IUser[] | undefined =
    allUsersQuery.data?.data?.data?.map(convertBackendUser);

  const backendUser = oneUserQuery.data?.data.data;
  const user: IUser | undefined =
    backendUser && convertBackendUser(backendUser);

  const paginatedUsers =
    ({ active }: { active: boolean }) =>
    (
      pageIndex: number,
      pageSize: number,
      sortField: keyof IUser,
      sortDirection: Direction
    ) => {
      const sortedUsersAsc = sortBy(users, [sortField]);
      const sortedUsers =
        sortDirection === "asc" ? sortedUsersAsc : reverse(sortedUsersAsc);

      const activeUsers = sortedUsers.filter((u) =>
        active ? u.active : !u.active
      );

      const paginatedUsers = activeUsers.slice(pageIndex, pageIndex + pageSize);

      return {
        pageOfItems: paginatedUsers,
        totalItemCount: users?.length ?? 0,
      };
    };

  return {
    paginatedUsers,
    user,
    createUserMutation,
    editUserMutation,
    deleteUserMutation,
    loading: !users,
  };
}
