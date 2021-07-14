import styled from "styled-components";

import {EuiForm} from "@elastic/eui";


export const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledEuiForm = styled(EuiForm)`
  width: 400px;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 32px;
  font-weight: bold;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 10px;

  & > *:not(:first-child) {
    margin-left: 10px;
  }
`;
