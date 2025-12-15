import type {AbstractExerciseDTO} from "./Exercise.ts";

export interface AbstractWorkoutDTO{
    name: string;
    description: string;
    userId: string;
}

export interface WorkoutDTO extends AbstractWorkoutDTO {
    id: string;
    lengthInMins: number;
    exercises: AbstractExerciseDTO[];
}

export interface WorkoutCreateDTO extends AbstractWorkoutDTO {}

export interface WorkoutUpdateDTO extends AbstractWorkoutDTO {
    lengthInMins: number;
}
