import styled from "styled-components";

import {EuiForm} from "@elastic/eui";


export const Container = styled(EuiForm)`
  display: flex;
  height: auto;
  flex-direction: column;
  align-items: center;
  //justify-content: center;  */
`;

export const StyledEuiForm = styled.div`
  width: 90%;
  margin:0 auto;
  display: grid;
  gap:20px;
  grid-template-rows: 60px;
  grid-template-columns:repeat(auto-fill, minmax(180px,1fr));
`;

export const StyledBooksPacks = styled(EuiForm)`
  width: 90%;
  margin:0;
  display: grid;
  gap:20px;
  grid-template-columns:repeat(2,1fr);
`;

export const StyledBooks = styled(EuiForm)`
  width: 100%;
  margin:10px 0;
  
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
