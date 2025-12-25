import type {WorkoutDTO} from "../types/fitness/Workout.ts";
import * as React from "react";


interface FinishedWorkoutProps {
    workout: WorkoutDTO | null;
    setWorkout: React.Dispatch<React.SetStateAction<WorkoutDTO | null>>;
}

const FinishedWorkoutSession = ({workout, setWorkout}: FinishedWorkoutProps) => {
    return(
        <div>{workout?.status}</div>
    );
}

export default FinishedWorkoutSession;