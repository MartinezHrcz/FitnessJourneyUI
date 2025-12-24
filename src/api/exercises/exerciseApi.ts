import type {AbstractExerciseDTO} from "../../types/fitness/Exercise.ts";
import axiosClient from "../axiosClient.ts";
import type {AbstractSetDTO} from "../../types/fitness/Set.ts";

export const exerciseApi = {
    create: (data: AbstractExerciseDTO) =>
        axiosClient.post<AbstractExerciseDTO>("/exercise", data),

    getAll: () =>
        axiosClient.get<Array<AbstractExerciseDTO>>("/exercise"),

    getById: (id: string) =>
        axiosClient.get<AbstractExerciseDTO>(`/exercise/${id}`),

    getByName: (name: string) =>
        axiosClient.get<Array<AbstractExerciseDTO>>(`/exercise/byname/${name}`),

    getByUser: (userId: string) =>
        axiosClient.get<Array<AbstractExerciseDTO>>(`/exercise/byuser/${userId}`),

    getByWorkout: (workoutId: string) =>
        axiosClient.get<Array<AbstractExerciseDTO>>(`/exercise/byworkout/${workoutId}`),

    delete: (id: string) =>
        axiosClient.delete(`/exercise/${id}`),

    addSet: (exerciseId: string, setData: AbstractSetDTO) =>
        axiosClient.put<AbstractExerciseDTO>(`/exercise/addset/${exerciseId}`, setData),

    updateSet: (exerciseId: string, setId: number, setData: AbstractSetDTO)=>
        axiosClient.put<AbstractExerciseDTO>(`/exercise/${exerciseId}/sets/${setId}`, setData),

    removeSet: (exerciseId: string, setId: number) =>
        axiosClient.delete<AbstractExerciseDTO>(`/exercise/removeset/${exerciseId}/${setId}`)
}
