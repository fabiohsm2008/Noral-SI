import { createContext, useContext } from "react";

import { useAuth } from "../auth";
import { Return } from "./definitions";

const UserContext = createContext<Return | undefined>(undefined);

export function UserProvider(props: any) {
  const auth = useAuth();

  return <UserContext.Provider value={{ user: auth.data }} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be within a UserProvider");
  }
  return context;
}
