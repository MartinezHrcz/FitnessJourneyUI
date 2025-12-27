import {authRoutes} from "./authRoutes.tsx";
import {userRoutes} from "./userRoutes.tsx";
import {workoutRoutes} from "./workoutRoutes.tsx";
import {socialRoutes} from "./socialRoutes.tsx";

export const appRoutes =[
    ...authRoutes,
    ...userRoutes,
    ...workoutRoutes,
    ...socialRoutes
];