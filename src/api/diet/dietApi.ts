import axiosClient from "../axiosClient.ts";
import type { FoodItemDTO, FoodItemCreateDTO } from "../../types/diet/Diet.ts";

export const foodItemApi = {
    searchFoods: (name: string) =>
        axiosClient.get<FoodItemDTO[]>("/v1/food-items/search", { params: { name } }),

    getFoodById: (id: string) =>
        axiosClient.get<FoodItemDTO>(`/v1/food-items/${id}`),

    createFoodItem: (data: FoodItemCreateDTO) =>
        axiosClient.post<FoodItemDTO>("/v1/food-items", data),
};