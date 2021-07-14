import { auth } from "services/firebase";

export const login = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const register = (email: string, password: string) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const logout = () => {
  return auth.signOut();
};
