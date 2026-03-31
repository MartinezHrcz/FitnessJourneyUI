import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { calorieLogApi } from "./calorieLogApi";
import type { CalorieLogDTO, MealEntryCreateDTO } from "../../types/diet/Diet";

vi.mock("../axiosClient");

describe("calorieLogApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDailyLog", () => {
    it("should fetch daily calorie log for a date", async () => {
      const mockLog: CalorieLogDTO = {
        date: "2024-03-31",
        totalCalories: 2000,
        goalCalories: 2500,
        meals: [],
      };

      (axiosClient.get as any).mockResolvedValue({ data: mockLog });

      const result = await calorieLogApi.getDailyLog("2024-03-31");

      expect(axiosClient.get).toHaveBeenCalledWith("/diet/log/2024-03-31");
      expect(result.data).toEqual(mockLog);
    });
  });

  describe("getHistoryLogs", () => {
    it("should fetch all historical calorie logs", async () => {
      const mockLogs: CalorieLogDTO[] = [
        {
          date: "2024-03-31",
          totalCalories: 2000,
          goalCalories: 2500,
          meals: [],
        },
        {
          date: "2024-03-30",
          totalCalories: 2200,
          goalCalories: 2500,
          meals: [],
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockLogs });

      const result = await calorieLogApi.getHistoryLogs();

      expect(axiosClient.get).toHaveBeenCalledWith("/diet/log/history");
      expect(result.data.length).toBe(2);
    });
  });

  describe("addMealToLog", () => {
    it("should add a meal entry to daily log", async () => {
      const mealData: MealEntryCreateDTO = {
        foodItemId: "1",
        quantity: 100,
        mealType: "BREAKFAST",
      };

      const mockLog: CalorieLogDTO = {
        date: "2024-03-31",
        totalCalories: 2165,
        goalCalories: 2500,
        meals: [
          {
            id: "meal1",
            foodItemId: "1",
            quantity: 100,
            mealType: "BREAKFAST",
            calories: 165,
          },
        ],
      };

      (axiosClient.post as any).mockResolvedValue({ data: mockLog });

      const result = await calorieLogApi.addMealToLog("2024-03-31", mealData);

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/diet/log/2024-03-31/meal",
        mealData
      );
      expect(result.data.totalCalories).toBe(2165);
    });

    it("should handle different meal types", async () => {
      const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

      for (const mealType of mealTypes) {
        const mealData: MealEntryCreateDTO = {
          foodItemId: "1",
          quantity: 100,
          mealType: mealType as any,
        };

        (axiosClient.post as any).mockResolvedValue({
          data: { date: "2024-03-31", totalCalories: 2000, goalCalories: 2500 },
        });

        await calorieLogApi.addMealToLog("2024-03-31", mealData);

        expect(axiosClient.post).toHaveBeenCalledWith(
          "/diet/log/2024-03-31/meal",
          mealData
        );
      }
    });
  });

  describe("removeMealFromLog", () => {
    it("should remove a meal entry from daily log", async () => {
      const mockLog: CalorieLogDTO = {
        date: "2024-03-31",
        totalCalories: 1835,
        goalCalories: 2500,
        meals: [],
      };

      (axiosClient.delete as any).mockResolvedValue({ data: mockLog });

      const result = await calorieLogApi.removeMealFromLog(
        "2024-03-31",
        "meal1"
      );

      expect(axiosClient.delete).toHaveBeenCalledWith(
        "/diet/log/2024-03-31/meal/meal1"
      );
      expect(result.data.totalCalories).toBe(1835);
    });
  });
});
