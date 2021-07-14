import { Rol } from "../../pages/Users/components/UserForm";

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: Rol;
  dni: string;
  active: boolean;
}
