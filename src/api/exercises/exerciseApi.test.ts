import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { exerciseApi } from "./exerciseApi";
import type { AbstractExerciseDTO } from "../../types/fitness/Exercise";
import type { AbstractSetDTO } from "../../types/fitness/Set";

vi.mock("../axiosClient");

describe("exerciseApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockExercise: AbstractExerciseDTO = {
    id: "1",
    name: "Bench Press",
    description: "Chest exercise",
    sets: [],
  };

  describe("create", () => {
    it("should create a new exercise", async () => {
      (axiosClient.post as any).mockResolvedValue({ data: mockExercise });

      const result = await exerciseApi.create(mockExercise);

      expect(axiosClient.post).toHaveBeenCalledWith("/exercise", mockExercise);
      expect(result.data).toEqual(mockExercise);
    });
  });

  describe("getAll", () => {
    it("should fetch all exercises", async () => {
      const mockExercises = [mockExercise];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await exerciseApi.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith("/exercise");
      expect(result.data).toEqual(mockExercises);
    });
  });

  describe("getById", () => {
    it("should fetch exercise by id", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: mockExercise });

      const result = await exerciseApi.getById("1");

      expect(axiosClient.get).toHaveBeenCalledWith("/exercise/1");
      expect(result.data).toEqual(mockExercise);
    });
  });

  describe("getByName", () => {
    it("should fetch exercises by name", async () => {
      const mockExercises = [mockExercise];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await exerciseApi.getByName("Bench Press");

      expect(axiosClient.get).toHaveBeenCalledWith("/exercise/byname/Bench Press");
      expect(result.data).toEqual(mockExercises);
    });
  });

  describe("getByUser", () => {
    it("should fetch exercises by user id", async () => {
      const mockExercises = [mockExercise];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await exerciseApi.getByUser("user1");

      expect(axiosClient.get).toHaveBeenCalledWith("/exercise/byuser/user1");
      expect(result.data).toEqual(mockExercises);
    });
  });

  describe("getByWorkout", () => {
    it("should fetch exercises by workout id", async () => {
      const mockExercises = [mockExercise];

      (axiosClient.get as any).mockResolvedValue({ data: mockExercises });

      const result = await exerciseApi.getByWorkout("workout1");

      expect(axiosClient.get).toHaveBeenCalledWith("/exercise/byworkout/workout1");
      expect(result.data).toEqual(mockExercises);
    });
  });

  describe("delete", () => {
    it("should delete an exercise", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await exerciseApi.delete("1");

      expect(axiosClient.delete).toHaveBeenCalledWith("/exercise/1");
    });
  });

  describe("addSet", () => {
    it("should add a set to exercise", async () => {
      const setData: AbstractSetDTO = {
        reps: 10,
        weight: 50,
      };

      const updatedExercise: AbstractExerciseDTO = {
        ...mockExercise,
        sets: [setData],
      };

      (axiosClient.put as any).mockResolvedValue({ data: updatedExercise });

      const result = await exerciseApi.addSet("1", setData);

      expect(axiosClient.put).toHaveBeenCalledWith("/exercise/addset/1", setData);
      expect(result.data.sets.length).toBe(1);
    });
  });

  describe("updateSet", () => {
    it("should update a set in exercise", async () => {
      const setData: AbstractSetDTO = {
        reps: 12,
        weight: 55,
      };

      const updatedExercise: AbstractExerciseDTO = {
        ...mockExercise,
        sets: [setData],
      };

      (axiosClient.put as any).mockResolvedValue({ data: updatedExercise });

      const result = await exerciseApi.updateSet("1", 1, setData);

      expect(axiosClient.put).toHaveBeenCalledWith(
        "/exercise/1/sets/1",
        setData
      );
      expect(result.data.sets[0].reps).toBe(12);
    });
  });

  describe("removeSet", () => {
    it("should remove a set from exercise", async () => {
      (axiosClient.delete as any).mockResolvedValue({ data: mockExercise });

      const result = await exerciseApi.removeSet("1", 1);

      expect(axiosClient.delete).toHaveBeenCalledWith(
        "/exercise/removeset/1/1"
      );
      expect(result.data).toEqual(mockExercise);
    });
  });
});
