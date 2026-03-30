import {authRoutes} from "./authRoutes.tsx";
import {mainRoutes} from "./mainRoutes.tsx";
import {userRoutes} from "./userRoutes.tsx";
import {workoutRoutes} from "./workoutRoutes.tsx";
import {socialRoutes} from "./socialRoutes.tsx";
import {dietRoutes} from "./dietRoutes.tsx";

export const appRoutes =[
    ...mainRoutes,
    ...authRoutes,
    ...userRoutes,
    ...workoutRoutes,
    ...socialRoutes,
    ...dietRoutes,
];