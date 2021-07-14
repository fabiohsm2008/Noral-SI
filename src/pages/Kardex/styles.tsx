import styled from "styled-components";
import { EuiPage, EuiPageSideBar } from "@elastic/eui";

export const StyledEuiPage = styled(EuiPage)`
  height: 100vh;
`;

export const StyledEuiPageSideBar = styled(EuiPageSideBar)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const SidebarTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
`;

export const NavigationLinksContainer = styled.nav`
  margin-top: 40px;
  cursor: pointer;
`;

export const NavigationLink = styled.div<{ active?: boolean }>`
  margin-top: 12px;

  font-weight: ${(props) => (props.active ? "bold" : undefined)};
`;

export const LogoutContainer = styled.div`
  align-self: center;
`;
