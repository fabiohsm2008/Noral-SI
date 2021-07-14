import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";

import { EuiFormRow, EuiPageBody, EuiPageContent } from "@elastic/eui";

import {
  LoginButton,
  LogoImg,
  LogoImgContainer,
  StyledEuiForm,
  StyledEuiPage,
} from "./Styles";

import { ControlledEuiFieldText } from "components/ControlledComponents/ControlledEuiFieldText";
import { ControlledEuiFieldPassword } from "components/ControlledComponents/ControlledEuiFieldPassword";

import Logo from "assets/logos/logo_color.png";

import { LoginFormValues } from "./definitions";

import { useAuth } from "context/auth";

export function Login() {
  const { handleSubmit, control } = useForm<LoginFormValues>();
  const { login, error } = useAuth();

  const [, setCookie] = useCookies(["name"]);

  useEffect(() => {
    if (error) {
      console.log(error.message); // todo: change to modal
    }
  }, [error]);

  const onSubmit = handleSubmit(async (data) => {
    const response = await login(data.email, data.password);
    setCookie("idToken", await response.user?.getIdToken());
  });

  return (
    <StyledEuiPage paddingSize="none">
      <EuiPageBody paddingSize="l">
        <EuiPageContent
          verticalPosition="center"
          horizontalPosition="center"
          paddingSize="l"
        >
          <LogoImgContainer>
            <LogoImg src={Logo} alt="Logo" />
          </LogoImgContainer>
          <StyledEuiForm component="form" onSubmit={onSubmit}>
            <EuiFormRow label="Correo Electrónico">
              <ControlledEuiFieldText
                control={control}
                name="email"
                placeholder="Ingrese su correo electrónico"
              />
            </EuiFormRow>
            <EuiFormRow label="Contraseña">
              <ControlledEuiFieldPassword
                control={control}
                name="password"
                placeholder="Ingrese su contraseña"
                type="dual"
              />
            </EuiFormRow>
            <LoginButton type="submit" fill>
              Iniciar sesión
            </LoginButton>
          </StyledEuiForm>
        </EuiPageContent>
      </EuiPageBody>
    </StyledEuiPage>
  );
}
