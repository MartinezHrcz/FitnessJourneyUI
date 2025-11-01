export interface userDTO {
    id: string;
    name: string;
    email: string;
    birthday: Date;
    weightInKg: number;
    heightIncm: number;
    role: string;
    token:string;
}

export interface createUserDTO {
    name: string;
    email: string;
    birthday: string;
    weightInKg: number;
    heightIncm: number;
    password: string;
}

export interface updateUserDTO {
    name: string;
    email: string;
    birthday: Date;
    weightInKg: number;
    heightIncm: number;
    role: string;
    token:string;
}

export interface updatePasswordDTO {
    oldPassword: string;
    newPassword: string;
}