import axiosClient from "../axiosClient.ts";
import type { FoodItemDTO, FoodItemCreateDTO } from "../../types/diet/Diet.ts";

export const foodItemApi = {
    searchFoods: (name: string, defaults?: boolean) =>
        axiosClient.get<FoodItemDTO[]>("/food-items/search", {
            params: { name, defaults }
        }),

    getFoodById: (id: string) =>
        axiosClient.get<FoodItemDTO>(`/food-items/${id}`),

    createFoodItem: (data: FoodItemCreateDTO) =>
        axiosClient.post<FoodItemDTO>("/food-items", data),

    getDefaultFoods: () =>
        axiosClient.get<FoodItemDTO[]>("/food-items/default"),

    getMyFoods: () =>
        axiosClient.get<FoodItemDTO[]>("/food-items/user/me"),

    deleteFoodItem: (id: string) =>
        axiosClient.delete(`/food-items/id`, { params: { id } })
};