import styled from "styled-components";
import { EuiButton, EuiForm, EuiPage } from "@elastic/eui";

export const StyledEuiPage = styled(EuiPage)`
  height: 100vh;
`;

export const StyledEuiForm = styled(EuiForm)`
  display: flex;
  width: 400px;
  flex-direction: column;
  align-items: stretch;
`;

export const LoginButton = styled(EuiButton)`
  align-self: center;
`;

export const LogoImgContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  margin-bottom: 20px;
`;

export const LogoImg = styled.img`
  width: 100px;
`;
