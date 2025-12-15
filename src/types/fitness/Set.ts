export interface AbstractSetDTO{
    id: string;
    exerciseId: string;
    type: 'STRENGTH' | 'CARDIO' | 'FLEXIBILITY' | string;
}

export interface StrengthSetDTO extends AbstractSetDTO {
    reps: number;
    weight: number;
    type: 'STRENGTH';
}

export interface FlexibilitySetDTO extends AbstractSetDTO {
    reps: number;
    type: 'FLEXIBILITY';
}

export interface CardioSetDTO extends AbstractSetDTO {
    durationInSeconds: number;
    distanceInKilometers: number;
    type: 'CARDIO';
}