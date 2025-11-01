import {authRoutes} from "./authRoutes.tsx";
import {userRoutes} from "./userRoutes.ts";

export const appRoutes =[
        ...authRoutes,
        ...userRoutes,
];