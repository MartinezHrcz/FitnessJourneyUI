import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { foodItemApi } from "./dietApi";
import type { FoodItemDTO, FoodItemCreateDTO } from "../../types/diet/Diet";

vi.mock("../axiosClient");

describe("foodItemApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchFoods", () => {
    it("should search foods by name", async () => {
      const mockFoods: FoodItemDTO[] = [
        {
          id: "1",
          name: "Chicken",
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockFoods });

      const result = await foodItemApi.searchFoods("Chicken");

      expect(axiosClient.get).toHaveBeenCalledWith("/food-items/search", {
        params: { name: "Chicken", defaults: undefined },
      });
      expect(result.data).toEqual(mockFoods);
    });

    it("should search default foods only", async () => {
      const mockFoods: FoodItemDTO[] = [
        {
          id: "1",
          name: "Apple",
          calories: 52,
          protein: 0.3,
          carbs: 14,
          fat: 0.2,
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockFoods });

      const result = await foodItemApi.searchFoods("Apple", true);

      expect(axiosClient.get).toHaveBeenCalledWith("/food-items/search", {
        params: { name: "Apple", defaults: true },
      });
      expect(result.data).toEqual(mockFoods);
    });
  });

  describe("getFoodById", () => {
    it("should fetch food item by id", async () => {
      const mockFood: FoodItemDTO = {
        id: "1",
        name: "Chicken",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
      };

      (axiosClient.get as any).mockResolvedValue({ data: mockFood });

      const result = await foodItemApi.getFoodById("1");

      expect(axiosClient.get).toHaveBeenCalledWith("/food-items/1");
      expect(result.data).toEqual(mockFood);
    });
  });

  describe("createFoodItem", () => {
    it("should create a new food item", async () => {
      const foodData: FoodItemCreateDTO = {
        name: "Custom Chicken",
        calories: 200,
        protein: 35,
        carbs: 0,
        fat: 5,
      };

      const mockFood: FoodItemDTO = {
        id: "custom1",
        ...foodData,
      };

      (axiosClient.post as any).mockResolvedValue({ data: mockFood });

      const result = await foodItemApi.createFoodItem(foodData);

      expect(axiosClient.post).toHaveBeenCalledWith("/food-items", foodData);
      expect(result.data).toEqual(mockFood);
    });
  });

  describe("getDefaultFoods", () => {
    it("should fetch all default foods", async () => {
      const mockFoods: FoodItemDTO[] = [
        {
          id: "1",
          name: "Apple",
          calories: 52,
          protein: 0.3,
          carbs: 14,
          fat: 0.2,
        },
        {
          id: "2",
          name: "Banana",
          calories: 89,
          protein: 1.1,
          carbs: 23,
          fat: 0.3,
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockFoods });

      const result = await foodItemApi.getDefaultFoods();

      expect(axiosClient.get).toHaveBeenCalledWith("/food-items/default");
      expect(result.data.length).toBe(2);
    });
  });

  describe("getMyFoods", () => {
    it("should fetch user's custom foods", async () => {
      const mockFoods: FoodItemDTO[] = [
        {
          id: "custom1",
          name: "My Custom Meal",
          calories: 500,
          protein: 40,
          carbs: 50,
          fat: 10,
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockFoods });

      const result = await foodItemApi.getMyFoods();

      expect(axiosClient.get).toHaveBeenCalledWith("/food-items/user/me");
      expect(result.data).toEqual(mockFoods);
    });
  });

  describe("deleteFoodItem", () => {
    it("should delete a food item", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await foodItemApi.deleteFoodItem("1");

      expect(axiosClient.delete).toHaveBeenCalledWith("/food-items/id", {
        params: { id: "1" },
      });
    });
  });
});
