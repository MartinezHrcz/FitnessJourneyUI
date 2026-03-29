export interface user {
    id: string;
    name: string;
    email: string;
    birthday: Date;
    weightInKg: number;
    heightInCm: number;
    preferredCalories: number;
    profilePictureUrl: string | null;
    token:string;
}

export interface createUser {
    name: string;
    email: string;
    birthday: string;
    weightInKg: number;
    heightInCm: number;
    password: string;
}

export interface updateUser {
    name: string;
    email: string;
    birthday: Date;
    weightInKg: number;
    heightInCm: number;
    preferredCalories: number | null;
    profilePictureUrl: string | null;
    token:string;
}

export interface updatePassword {
    oldPassword: string;
    newPassword: string;
}