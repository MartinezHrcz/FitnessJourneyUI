import {authRoutes} from "./authRoutes.tsx";
import {userRoutes} from "./userRoutes.tsx";
import {workoutRoutes} from "./workoutRoutes.tsx";

export const appRoutes =[
    ...authRoutes,
    ...userRoutes,
    ...workoutRoutes
];