import {authRoutes} from "./authRoutes.tsx";
import {userRoutes} from "./userRoutes.tsx";

export const appRoutes =[
        ...authRoutes,
        ...userRoutes,
];