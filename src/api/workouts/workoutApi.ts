import axiosClient from "../axiosClient.ts";
import type {user} from "../../types/User.ts";

export const workoutApi = {
    getAllUsers: () => axiosClient.get<Array<user>>("/user"),

}