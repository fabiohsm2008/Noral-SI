import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CookiesProvider } from "react-cookie";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import { AuthProvider } from "./context/auth";
import { UserProvider, useUser } from "./context/user/user";

import { Login } from "./pages/Login";
import { Books } from "./pages/Books";
import { Users } from "./pages/Users";
import { Sales } from "pages/Sales";
import { Packages } from "./pages/Packages";
import { Kardex } from "./pages/Kardex";
import { EmitSale } from "./pages/EmitSale";

function AuthenticatedApp() {
  const history = useHistory();
  const { user } = useUser();
  const { path } = useRouteMatch();

  useEffect(() => {
    if (!user) return;

    if (
      user?.backendUser?.role === "VENDEDOR" &&
      path !== "sales" &&
      path !== "emitSale"
    ) {
      history.push("/sales");
    } else if (
      user?.backendUser?.role === "ALMACENERO" &&
      path !== "kardex" &&
      path !== "packages" &&
      path !== "books"
    ) {
      history.push("/kardex");
    } else if (user?.backendUser?.role === "SUPERVISOR" && path !== "users") {
      history.push("/users");
    }
  }, [user, history, path]);

  return (
    <Switch>
      <Route path="/books" component={Books} />
      <Route path="/users" component={Users} />
      <Route path="/sales" component={Sales} />
      <Route path="/emitSale" component={EmitSale} />
      <Route path="/packages" component={Packages} />
      <Route path="/kardex" component={Kardex} />
    </Switch>
  );
}

function UnauthenticatedApp() {
  return (
    <Switch>
      <Route path="/" component={Login} />
    </Switch>
  );
}

function App() {
  const { user } = useUser();

  const isAuthenticated = user.isAuth;

  return (
    <Providers>
      <Router>
        {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Router>
    </Providers>
  );
}

type ProviderProps = {
  children: ReactNode;
};

function Providers({ children }: ProviderProps) {
  return (
    <CookiesProvider>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </CookiesProvider>
  );
}

function AppContainer() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

export default AppContainer;
