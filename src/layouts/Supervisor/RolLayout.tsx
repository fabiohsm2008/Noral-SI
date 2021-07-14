import { ReactNode } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { useAuth } from "context/auth";

import { EuiPageBody, EuiPageContent, EuiPageContentBody } from "@elastic/eui";
import {
  LogoutContainer,
  NavigationLink,
  NavigationLinksContainer,
  SidebarTitle,
  StyledEuiPage,
  StyledEuiPageSideBar,
} from "./styles";
import { useUser } from "../../context/user/user";
import { Rol } from "../../pages/Users/components/UserForm";

type Props = {
  children: ReactNode;
};

export const navigationMenuLinksByRole: Record<
  Rol,
  { text: string; path: string }[]
> = {
  VENDEDOR: [
    {
      text: "Explorar Ventas",
      path: "/sales",
    },
    {
      text: "Emitir Ventas",
      path: "/emitSale",
    },
  ],
  SUPERVISOR: [
    {
      text: "Manejar Usuarios",
      path: "/users",
    },
  ],
  ALMACENERO: [
    {
      text: "Kardex",
      path: "/kardex",
    },
    {
      text: "Manejar Paquetes",
      path: "/packages",
    },
    {
      text: "Manejar Libros",
      path: "/books",
    },
  ],
};

export function RolLayout({ children }: Props) {
  const history = useHistory();
  const { logout } = useAuth();
  const { path } = useRouteMatch();
  const { user } = useUser();

  const navigationMenuLinks =
    navigationMenuLinksByRole[user?.backendUser?.role ?? "ALMACENERO"];

  const handleLogout = async () => {
    history.push("/");
    await logout();
  };

  return (
    <StyledEuiPage paddingSize="none">
      <StyledEuiPageSideBar paddingSize="l" sticky>
        <div>
          <SidebarTitle>Grupo Noral</SidebarTitle>

          <NavigationLinksContainer>
            {navigationMenuLinks.map((item) => (
              <NavigationLink
                active={path === item.path}
                onClick={() => history.push(item.path)}
                key={item.text}
              >
                {item.text}
              </NavigationLink>
            ))}
          </NavigationLinksContainer>
        </div>
        <LogoutContainer>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </LogoutContainer>
      </StyledEuiPageSideBar>

      <EuiPageBody panelled>
        <EuiPageContent
          hasBorder={false}
          hasShadow={false}
          paddingSize="none"
          color="transparent"
          borderRadius="none"
        >
          <EuiPageContentBody restrictWidth>{children}</EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </StyledEuiPage>
  );
}
