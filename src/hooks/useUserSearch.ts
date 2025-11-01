import {useQuery} from "@tanstack/react-query";
import {userApi} from "../api/users/userApi.ts";

export function useUserSearch(params: {id?: string, username?: string, email?: string}) {
    return useQuery(
        {
            queryKey: ["useSearch", params],
            queryFn: () => userApi.getUserSearch(params).then(res => res.data),
            enabled: !!params,
        }
    );
}