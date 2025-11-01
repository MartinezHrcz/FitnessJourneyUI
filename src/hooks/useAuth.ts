import {useMutation} from "@tanstack/react-query";
import {authApi} from "../api/auth/authApi.ts";

export function useAuth() {
    const login = useMutation(
        {mutationFn: authApi.login}
    );
    const register = useMutation(
        {mutationFn: authApi.registerUser}
    );
    return {login, register};
}