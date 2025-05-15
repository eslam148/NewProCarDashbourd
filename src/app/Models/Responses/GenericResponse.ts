import { Status } from "../../Enums/Status.enum";

export interface GenericResponse<T> {
  status: Status;
  subStatus: number;
  message: string;
  internalMessage: string;
  data: T;
}

