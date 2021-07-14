import firebase from "firebase";
import { login, logout, register } from "./utils";
import { IUser } from "../../services/users/definitions";

export type UserData =
  | (firebase.User & { backendUser: IUser; isAuth: boolean })
  | null
  | undefined;

export type Return = {
  data: UserData;
  login: typeof login;
  logout: typeof logout;
  register: typeof register;
  error: firebase.FirebaseError | undefined;
};
