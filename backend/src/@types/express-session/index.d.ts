import "express-session";
import { IUser } from "../../models/User";

declare module "express-session" {
  interface SessionData {
    user?: IUser | any;
    refreshToken?: string;
  }
}
