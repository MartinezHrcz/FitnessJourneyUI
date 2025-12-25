import type {AbstractSetDTO, CardioSetDTO, FlexibilitySetDTO, StrengthSetDTO} from "./Set.ts";

export interface AbstractExerciseDTO {
    id: string;
    name: string;
    description: string;
    workoutId: string;
    weightType: 'CABLES' | 'FREE_WEIGHT' | 'MACHINE' | 'BODYWEIGHT' | 'NOT_GIVEN' | string;
    type: 'RESISTANCE' | 'NOT_GIVEN' | 'BODY_WEIGHT' | 'CARDIO' | 'FLEXIBILITY';
    sets: AbstractSetDTO[];
}

export interface ExerciseStrengthSetDTO extends AbstractExerciseDTO {
    sets: StrengthSetDTO[];
}

export interface ExerciseFlexibilitySetDTO extends AbstractExerciseDTO {
    sets: FlexibilitySetDTO[];
}

export interface ExerciseCardioSetDTO extends AbstractExerciseDTO {
    sets: CardioSetDTO[];
}

export type ExerciseSetDTO = ExerciseStrengthSetDTO | ExerciseCardioSetDTO | ExerciseFlexibilitySetDTO;