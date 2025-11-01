import type {userDTO} from "./User.ts";

export interface authRequest{
    username: string;
    password: string;
}
export interface authResponse{
    user: userDTO;
    token: string;
}