import styled from "styled-components";
import { EuiForm } from "@elastic/eui";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  gap: 2.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledEuiForm = styled(EuiForm)`
  width: 800px;
  display: flex;
  gap: 2rem;
  flex-direction: row;
`;

export const KardexData = styled.div`
  flex: 1;
`;

export const KardexBooks = styled.div`
  flex: 1;
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
