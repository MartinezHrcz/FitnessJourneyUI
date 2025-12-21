import axiosClient from "../axiosClient.ts";
import type {WorkoutCreateDTO, WorkoutDTO, WorkoutUpdateDTO} from "../../types/fitness/Workout.ts";

export const workoutApi = {
    getAll: () =>
        axiosClient.get<Array<WorkoutDTO>>("/workout"),

    getById: (id: string) =>
        axiosClient.get<WorkoutDTO>(`/workout/${id}`),

    getByUserId: (userId: string) =>
        axiosClient.get<WorkoutDTO>(`/workout/byuser/${userId}`),

    create: (data: WorkoutCreateDTO) =>
        axiosClient.post<string>(`/workout`, data),

    update: (id: string, data: WorkoutUpdateDTO) =>
        axiosClient.put<WorkoutDTO>(`/workout/${id}`, data),

    delete: (id: string) =>
        axiosClient.delete(`/workout/${id}`),

    addExerciseToWorkout: (workoutId: string, exerciseId: string) =>
        axiosClient.put<WorkoutDTO>(`/workout/addexc/${workoutId}-${exerciseId}`),

    addDefaultExerciseToWorkout: (workoutId: string, templateId: string) =>
        axiosClient.put<WorkoutDTO>(`/workout/addexc/template/default/${workoutId}-${templateId}`),

    addUserExerciseToWorkout: (workoutId: string, templateId: string) =>
        axiosClient.put<WorkoutDTO>(`/workout/addexc/template/usermade/${workoutId}-${templateId}`),

    removeExerciseFromWorkout: (workoutId: string, exerciseId: string) =>
        axiosClient.delete<WorkoutDTO>(`/workout/rmexc/${workoutId}-${exerciseId}`),
}