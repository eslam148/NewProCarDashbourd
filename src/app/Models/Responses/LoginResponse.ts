import { LoginStatus } from "../../Enums/LoginStatus";
import { Roles } from "../../Enums/Roles.enum";

export interface LoginResponse {
  token: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthOfDate: Date;
  role: Roles;
  loginStatus: LoginStatus;
}
