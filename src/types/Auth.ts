import type {userDTO} from "./User.ts";

export interface authRequest{
    username: string;
    password: string;
}
export interface authResponse{
    userDto: userDTO;
    token: string;
}