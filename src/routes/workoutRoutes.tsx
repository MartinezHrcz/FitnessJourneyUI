import WorkoutMainPage from "../pages/fitness/WorkoutMainPage.tsx";
import WorkoutSessionPage from "../pages/fitness/WorkoutSessionPage.tsx";
import WorkoutHistoryPage from "../pages/fitness/WorkoutHistoryPage.tsx";
import WorkoutPlanCreator from "../pages/fitness/WorkoutPlanCreator.tsx";

export const workoutRoutes = [
    {path: "/workouts", element: <WorkoutMainPage />},
    {path: "/workouts/session/:id", element: <WorkoutSessionPage />},
    {path: "/workouts/history", element: <WorkoutHistoryPage />},
    {path: "/workouts/plans/create", element: <WorkoutPlanCreator />}
]