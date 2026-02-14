import axiosClient from "../axiosClient.ts";
import type { CalorieLogDTO, MealEntryCreateDTO } from "../../types/diet/Diet.ts";

export const calorieLogApi = {
    getDailyLog: (date: string) =>
        axiosClient.get<CalorieLogDTO>(`/diet/log/${date}`),

    getHistoryLogs: () =>
        axiosClient.get<CalorieLogDTO[]>("/diet/log/history"),

    addMealToLog: (date: string, data: MealEntryCreateDTO) =>
        axiosClient.post<CalorieLogDTO>(`/diet/log/${date}/meal`, data),

    removeMealFromLog: (date: string, mealEntryId: string) =>
        axiosClient.delete<CalorieLogDTO>(`/diet/log/${date}/meal/${mealEntryId}`),
};