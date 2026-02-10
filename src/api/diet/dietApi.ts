import axiosClient from "../axiosClient.ts";
import type { FoodItemDTO, FoodItemCreateDTO } from "../../types/diet/Diet.ts";

export const foodItemApi = {
    searchFoods: (name: string) =>
        axiosClient.get<FoodItemDTO[]>("/food-items/search", { params: { name } }),

    getFoodById: (id: string) =>
        axiosClient.get<FoodItemDTO>(`/food-items/${id}`),

    createFoodItem: (data: FoodItemCreateDTO) =>
        axiosClient.post<FoodItemDTO>("/food-items", data),
};