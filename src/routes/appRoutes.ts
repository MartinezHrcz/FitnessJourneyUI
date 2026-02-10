import {authRoutes} from "./authRoutes.tsx";
import {userRoutes} from "./userRoutes.tsx";
import {workoutRoutes} from "./workoutRoutes.tsx";
import {socialRoutes} from "./socialRoutes.tsx";
import {dietRoutes} from "./dietRoutes.tsx";

export const appRoutes =[
    ...authRoutes,
    ...userRoutes,
    ...workoutRoutes,
    ...socialRoutes,
    ...dietRoutes,
];