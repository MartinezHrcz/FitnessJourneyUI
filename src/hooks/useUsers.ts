import {useMutation, useQuery} from "@tanstack/react-query";
import {userApi} from "../api/users/userApi.ts";
import type {updateUserDTO} from "../types/User.ts";

export function useUsers() {

    const users =  useQuery(
        {
            queryKey:["users"],
            queryFn: () =>  userApi.getAllUsers().then(res => res.data),
        }
    );

    const updateUser = useMutation(
        {
            mutationFn: ({id, data} : {id:string, data:updateUserDTO}) =>
                userApi.updateUser(id, data).then(res => res.data),
        }
    );

    const deleteUser = useMutation(
        {
            mutationFn: (id:string) => userApi.deleteUser(id),
        }
    );

    return {users, updateUser, deleteUser};
}