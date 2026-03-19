import type {user} from "./User.ts";

export interface authRequest{
    username: string;
    password: string;
}
export interface authResponse{
    user: user;
    token: string;
    refreshToken: string;
}

export interface refreshTokenRequest {
    refreshToken: string;
}