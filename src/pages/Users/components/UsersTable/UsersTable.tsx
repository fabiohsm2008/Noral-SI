import { IUser } from "services/users/definitions";
import { useUsers } from "services/users/users.hook";
import { CRUDTable } from "../../../../components/CRUDTable/CRUDTable";

export function UsersTable() {
  const { paginatedUsers, deleteUserMutation } = useUsers();

  const handleDeleteUser = async (user: IUser) => {
    await deleteUserMutation.mutateAsync(String(user.id));
  };

  const handleDeleteMultipleUsers = async (selectedItems: IUser[]) => {
    await Promise.all(
      selectedItems.map((user) =>
        deleteUserMutation.mutateAsync(String(user.id))
      )
    );
  };

  return (
    <CRUDTable<IUser>
      entityNameSingular="usuario"
      entityNamePlural="usuarios"
      initialSortField="role"
      getPaginatedEntities={paginatedUsers}
      onDelete={handleDeleteUser}
      onDeleteMultiple={handleDeleteMultipleUsers}
      columns={[
        {
          field: "name",
          name: "Nombre",
          truncateText: true,
          sortable: true,
        },
        {
          field: "role",
          name: "Rol",
          truncateText: true,
          sortable: true,
        },
      ]}
    />
  );
}
