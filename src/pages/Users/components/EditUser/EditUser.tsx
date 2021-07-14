import { EuiLoadingSpinner } from "@elastic/eui";
import { IUser } from "services/users/definitions";
import { useHistory, useParams } from "react-router-dom";

import { UserForm } from "../UserForm";

import { useUsers } from "services/users/users.hook";

export function EditUser() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const { user, editUserMutation } = useUsers({ id });

  const handleSubmitForm = async (data: IUser) => {
    const editedUser = {
      ...data,
      name: String(data.name),
      email: String(data.email),
      password: String(data.password),
      role: String(data.role),
      dni: String(data.dni),
      id,
    };

    try {
      await editUserMutation.mutateAsync(editedUser);

      history.push(`/users`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    history.push(`/users`);
  };

  return (
    <>
      {user ? (
        <UserForm
          title="Editar Usuario"
          buttonTitle="Editar"
          user={user}
          onSubmit={handleSubmitForm}
          onCancel={handleCancel}
        />
      ) : (
        <EuiLoadingSpinner size="l" />
      )}
    </>
  );
}
