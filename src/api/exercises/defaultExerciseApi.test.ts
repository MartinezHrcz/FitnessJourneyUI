import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import defaultExerciseApi from "./defaultExerciseApi";
import type { AbstractExerciseDTO } from "../../types/fitness/Exercise";

vi.mock("../axiosClient");

describe("defaultExerciseApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockExercise: AbstractExerciseDTO = {
    id: "default1",
    name: "Push-ups",
    description: "Bodyweight chest exercise",
    sets: [],
  };

  describe("getAll", () => {
    it("should fetch all default exercises", async () => {
      const mockExercises = [
        mockExercise,
        {
          id: "default2",
          name: "Squats",
          description: "Leg exercise",
          sets: [],
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await defaultExerciseApi.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith("default/exercise");
      expect(result.data.length).toBe(2);
      expect(result.data).toEqual(mockExercises);
    });

    it("should handle empty default exercises", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: [] });

      const result = await defaultExerciseApi.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith("default/exercise");
      expect(result.data).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should fetch default exercise by id", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: mockExercise });

      const result = await defaultExerciseApi.getById("default1");

      expect(axiosClient.get).toHaveBeenCalledWith("default/exercise/default1");
      expect(result.data).toEqual(mockExercise);
    });

    it("should handle non-existent exercise", async () => {
      const error = new Error("Not found");
      (axiosClient.get as any).mockRejectedValue(error);

      await expect(defaultExerciseApi.getById("nonexistent")).rejects.toThrow(
        "Not found"
      );
    });
  });

  describe("getByName", () => {
    it("should fetch default exercises by name", async () => {
      const mockExercises = [mockExercise];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await defaultExerciseApi.getByName("Push-ups");

      expect(axiosClient.get).toHaveBeenCalledWith(
        "default/exercise/byname/Push-ups"
      );
      expect(result.data).toEqual(mockExercises);
    });

    it("should handle partial name matches", async () => {
      const mockExercises = [mockExercise];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await defaultExerciseApi.getByName("Push");

      expect(axiosClient.get).toHaveBeenCalledWith(
        "default/exercise/byname/Push"
      );
      expect(result.data.length).toBe(1);
      expect(result.data[0].name).toContain("Push");
    });

    it("should return empty array for no matches", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: [] });

      const result = await defaultExerciseApi.getByName("NonExistent");

      expect(axiosClient.get).toHaveBeenCalledWith(
        "default/exercise/byname/NonExistent"
      );
      expect(result.data).toEqual([]);
    });
  });
});
