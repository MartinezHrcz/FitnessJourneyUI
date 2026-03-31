import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { workoutPlanApi } from "./workoutPlanApi";
import type {
  WorkoutPlanDTO,
  WorkoutPlanCreateDTO,
} from "../../types/fitness/WorkoutPlan";

vi.mock("../axiosClient");

describe("workoutPlanApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPlan: WorkoutPlanDTO = {
    id: "1",
    name: "Beginner Push/Pull",
    description: "Perfect for beginners",
    weeks: 4,
    difficulty: "BEGINNER",
    exercises: [],
  };

  describe("getAvailable", () => {
    it("should fetch all available workout plans", async () => {
      const mockPlans = [mockPlan];

      (axiosClient.get as any).mockResolvedValue({ data: mockPlans });

      const result = await workoutPlanApi.getAvailable();

      expect(axiosClient.get).toHaveBeenCalledWith("/workout-plan/available");
      expect(result.data).toEqual(mockPlans);
    });

    it("should handle empty plan list", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: [] });

      const result = await workoutPlanApi.getAvailable();

      expect(result.data).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should fetch workout plan by id", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: mockPlan });

      const result = await workoutPlanApi.getById("1");

      expect(axiosClient.get).toHaveBeenCalledWith("/workout-plan/1");
      expect(result.data).toEqual(mockPlan);
    });
  });

  describe("searchByName", () => {
    it("should search workout plans by name", async () => {
      const mockPlans = [mockPlan];

      (axiosClient.get as any).mockResolvedValue({ data: mockPlans });

      const result = await workoutPlanApi.searchByName("Beginner");

      expect(axiosClient.get).toHaveBeenCalledWith("/workout-plan/search", {
        params: { name: "Beginner" },
      });
      expect(result.data).toEqual(mockPlans);
    });

    it("should handle partial name matches", async () => {
      const mockPlans = [mockPlan];

      (axiosClient.get as any).mockResolvedValue({ data: mockPlans });

      const result = await workoutPlanApi.searchByName("Push");

      expect(axiosClient.get).toHaveBeenCalledWith("/workout-plan/search", {
        params: { name: "Push" },
      });
      expect(result.data[0].name).toContain("Push");
    });

    it("should return empty array for no matches", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: [] });

      const result = await workoutPlanApi.searchByName("NonExistent");

      expect(result.data).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create a new workout plan", async () => {
      const planData: WorkoutPlanCreateDTO = {
        name: "Beginner Push/Pull",
        description: "Perfect for beginners",
        weeks: 4,
        difficulty: "BEGINNER",
      };

      (axiosClient.post as any).mockResolvedValue({ data: mockPlan });

      const result = await workoutPlanApi.create(planData);

      expect(axiosClient.post).toHaveBeenCalledWith("/workout-plan", planData);
      expect(result.data).toEqual(mockPlan);
    });

    it("should handle invalid plan data", async () => {
      const planData: any = {
        name: "",
        description: "",
        weeks: -1,
      };

      const error = new Error("Invalid plan data");
      (axiosClient.post as any).mockRejectedValue(error);

      await expect(workoutPlanApi.create(planData)).rejects.toThrow(
        "Invalid plan data"
      );
    });
  });

  describe("delete", () => {
    it("should delete a workout plan", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await workoutPlanApi.delete("1");

      expect(axiosClient.delete).toHaveBeenCalledWith(
        "/workout-plan/1/user/me"
      );
    });

    it("should handle deletion of non-existent plan", async () => {
      const error = new Error("Plan not found");
      (axiosClient.delete as any).mockRejectedValue(error);

      await expect(workoutPlanApi.delete("nonexistent")).rejects.toThrow(
        "Plan not found"
      );
    });
  });

  describe("startWorkoutFromPlan", () => {
    it("should start a workout from a plan", async () => {
      const workoutId = "workout123";

      (axiosClient.post as any).mockResolvedValue({ data: workoutId });

      const result = await workoutPlanApi.startWorkoutFromPlan("1");

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/workout-plan/1/start/me"
      );
      expect(result.data).toEqual(workoutId);
    });

    it("should handle plan not found", async () => {
      const error = new Error("Plan not found");
      (axiosClient.post as any).mockRejectedValue(error);

      await expect(
        workoutPlanApi.startWorkoutFromPlan("nonexistent")
      ).rejects.toThrow("Plan not found");
    });
  });
});
