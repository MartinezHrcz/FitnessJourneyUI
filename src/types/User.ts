export interface user {
    id: string;
    name: string;
    email: string;
    birthday: Date;
    weightInKg: number;
    heightIncm: number;
    role: string;
    token:string;
}

export interface createUser {
    name: string;
    email: string;
    birthday: string;
    weightInKg: number;
    heightIncm: number;
    password: string;
}

export interface updateUser {
    name: string;
    email: string;
    birthday: Date;
    weightInKg: number;
    heightIncm: number;
    role: string;
    token:string;
}

export interface updatePassword {
    oldPassword: string;
    newPassword: string;
}