export interface AbstractWorkoutPlanDTO {
    name: string;
    description?: string;
}

export interface PlanExerciseDTO {
    id: string;
    exerciseTemplateId: string;
    name: string;
    type: 'RESISTANCE' | 'CARDIO' | 'BODY_WEIGHT' | 'FLEXIBILITY' | string;
    targetSets: number;
}

export interface PlanExerciseRequestDTO {
    exerciseTemplateId: string;
    targetSets: number;
}

export interface WorkoutPlanCreateDTO extends AbstractWorkoutPlanDTO {
    userId: string;
    exercises: PlanExerciseRequestDTO[];
}

export interface WorkoutPlanDTO extends AbstractWorkoutPlanDTO {
    id: string;
    creatorId?: string | null;
    exercises: PlanExerciseDTO[];
}