import { User } from "../users/interface";

export type UserResponse = {
  jwt: string;
  user: User;
};
