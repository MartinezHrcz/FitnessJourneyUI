import axiosClient from "../axiosClient.ts";
import type { CalorieLogDTO, MealEntryCreateDTO } from "../../types/diet/Diet.ts";

export const calorieLogApi = {
    getDailyLog: (userId: string, date: string) =>
        axiosClient.get<CalorieLogDTO>(`/v1/diet/log/${date}`, { params: { userId } }),

    addMealToLog: (userId: string, date: string, data: MealEntryCreateDTO) =>
        axiosClient.post<CalorieLogDTO>(`/v1/diet/log/${date}/meal`, data, { params: { userId } }),

    removeMealFromLog: (userId: string, date: string, mealEntryId: string) =>
        axiosClient.delete<CalorieLogDTO>(`/v1/diet/log/${date}/meal/${mealEntryId}`, { params: { userId } }),
};