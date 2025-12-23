import type {AbstractExerciseDTO} from "../../types/fitness/Exercise.ts";
import axiosClient from "../axiosClient.ts";

export const defaultExerciseApi = {
    getAll: () =>
        axiosClient.get<Array<AbstractExerciseDTO>>("default/exercise"),

    getById: (id:string) =>
        axiosClient.get<AbstractExerciseDTO>(`default/exercise/${id}`),

    getByName: (name: string) =>
        axiosClient.get<Array<AbstractExerciseDTO>>(`default/exercise/byname/${name}`),
}

export default defaultExerciseApi;