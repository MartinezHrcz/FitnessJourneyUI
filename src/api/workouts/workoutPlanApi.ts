import axiosClient from "../axiosClient.ts";
import type {
    WorkoutPlanDTO,
    WorkoutPlanCreateDTO
} from "../../types/fitness/WorkoutPlan.ts";

export const workoutPlanApi = {
    getAvailable: () =>
        axiosClient.get<WorkoutPlanDTO[]>(`/workout-plan/available/me`),

    getById: (id: string) =>
        axiosClient.get<WorkoutPlanDTO>(`/workout-plan/${id}`),

    searchByName: (name: string) =>
        axiosClient.get<WorkoutPlanDTO[]>(`/workout-plan/search`, {
            params: { name }
        }),

    create: (data: WorkoutPlanCreateDTO) =>
        axiosClient.post<WorkoutPlanDTO>(`/workout-plan`, data),

    delete: (planId: string) =>
        axiosClient.delete(`/workout-plan/${planId}/user/me`),

    startWorkoutFromPlan: (planId: string) =>
        axiosClient.post<string>(`/workout-plan/${planId}/start/me`),
}