import WorkoutMainPage from "../pages/fitness/WorkoutMainPage.tsx";
import WorkoutSessionPage from "../pages/fitness/WorkoutSessionPage.tsx";

export const workoutRoutes = [
    {path: "/workouts", element: <WorkoutMainPage />},
    {path: "/workouts/session/:id", element: <WorkoutSessionPage />}
]