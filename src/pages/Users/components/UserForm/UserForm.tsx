import { ReactNode, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EuiButton, EuiButtonEmpty, EuiFormRow } from "@elastic/eui";

import { ButtonsContainer, Container, StyledEuiForm, Title } from "./styles";

import { IUser } from "services/users/definitions";

import { ControlledEuiFieldText } from "components/ControlledComponents/ControlledEuiFieldText";
import { ControlledEuiSelect } from "components/ControlledComponents/ControlledEuiSelect";

type UserFormValues = IUser;

export type Rol = "ALMACENERO" | "VENDEDOR" | "SUPERVISOR";

const roles: Rol[] = ["ALMACENERO", "VENDEDOR", "SUPERVISOR"];

type Props = {
  title: ReactNode;
  buttonTitle: ReactNode;
  user?: IUser;
  onSubmit: (data: IUser) => void;
  onCancel: () => void;
};

export function UserForm({
  title,
  buttonTitle,
  user,
  onSubmit,
  onCancel,
}: Props) {
  const { handleSubmit, control, reset } = useForm<UserFormValues>();

  useEffect(() => {
    reset({
      ...user,
    });
  }, [reset, user]);

  const handleSubmitForm = handleSubmit((data) => {
    onSubmit(data);
  });

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Container>
      <Title>{title}</Title>
      <StyledEuiForm component="form" onSubmit={handleSubmitForm}>
        <EuiFormRow label="Nombre">
          <ControlledEuiFieldText
            control={control}
            name="name"
            placeholder="Ingrese nombre del Usuario"
          />
        </EuiFormRow>
        <EuiFormRow label="Email">
          <ControlledEuiFieldText
            control={control}
            name="email"
            placeholder="Ingrese Email"
          />
        </EuiFormRow>
        <EuiFormRow label="Dni">
          <ControlledEuiFieldText
            control={control}
            name="dni"
            placeholder="Ingrese Dni"
          />
        </EuiFormRow>
        <EuiFormRow label="Contraseña">
          <ControlledEuiFieldText
            control={control}
            name="password"
            type="password"
            placeholder="Ingrese Contraseña"
          />
        </EuiFormRow>
        <EuiFormRow label="Rol">
          <ControlledEuiSelect
            control={control}
            name="role"
            options={roles.map((role) => ({
              value: role,
              text: role,
            }))}
          />
        </EuiFormRow>
        <EuiFormRow>
          <ButtonsContainer>
            <EuiButtonEmpty onClick={() => handleCancel()}>
              Cancelar
            </EuiButtonEmpty>
            <EuiButton type="submit" fill>
              {buttonTitle}
            </EuiButton>
          </ButtonsContainer>
        </EuiFormRow>
      </StyledEuiForm>
    </Container>
  );
}
