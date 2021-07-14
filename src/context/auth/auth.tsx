import { createContext, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { Return } from "./definitions";
import { login, logout, register } from "./utils";

import { auth } from "services/firebase";

import { FullPageSpinner } from "components/ui/FullPageSpinner";
import { useUsers } from "../../services/users/users.hook";

const AuthContext = createContext<Return | undefined>(undefined);

function AuthProvider(props: any) {
  const [user, loadingAuth, error] = useAuthState(auth);
  const { paginatedUsers, loading: loadingUsers } = useUsers();

  if (loadingAuth || loadingUsers) {
    return <FullPageSpinner />;
  }

  const backendUsers = paginatedUsers({ active: true })(0, 1000, "id", "asc");

  const backendUser = backendUsers.pageOfItems.find(
    (item) => item.email === user?.email
  );

  return (
    <AuthContext.Provider
      value={{
        data: { ...user, backendUser, isAuth: !!user },
        login,
        register,
        logout,
        error,
      }}
      {...props}
    />
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
