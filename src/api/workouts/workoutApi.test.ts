import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { workoutApi } from "./workoutApi";
import type {
  WorkoutCreateDTO,
  WorkoutDTO,
  WorkoutUpdateDTO,
} from "../../types/fitness/Workout";

vi.mock("../axiosClient");

describe("workoutApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockWorkout: WorkoutDTO = {
    id: "1",
    name: "Chest Day",
    exercises: [],
    startTime: new Date(),
    endTime: null,
    status: "IN_PROGRESS",
  };

  describe("getAll", () => {
    it("should fetch all workouts", async () => {
      const mockWorkouts = [mockWorkout];

      (axiosClient.get as any).mockResolvedValue({ data: mockWorkouts });

      const result = await workoutApi.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith("/workout");
      expect(result.data).toEqual(mockWorkouts);
    });
  });

  describe("getById", () => {
    it("should fetch workout by id", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: mockWorkout });

      const result = await workoutApi.getById("1");

      expect(axiosClient.get).toHaveBeenCalledWith("/workout/1");
      expect(result.data).toEqual(mockWorkout);
    });
  });

  describe("getByUserId", () => {
    it("should fetch workouts by user id", async () => {
      const mockWorkouts = [mockWorkout];

      (axiosClient.get as any).mockResolvedValue({ data: mockWorkouts });

      const result = await workoutApi.getByUserId("user1");

      expect(axiosClient.get).toHaveBeenCalledWith("/workout/byuser/user1");
      expect(result.data).toEqual(mockWorkouts);
    });
  });

  describe("create", () => {
    it("should create a new workout", async () => {
      const workoutData: WorkoutCreateDTO = {
        name: "Chest Day",
      };

      (axiosClient.post as any).mockResolvedValue({ data: "1" });

      const result = await workoutApi.create(workoutData);

      expect(axiosClient.post).toHaveBeenCalledWith("/workout", workoutData);
      expect(result.data).toEqual("1");
    });
  });

  describe("update", () => {
    it("should update a workout", async () => {
      const updateData: WorkoutUpdateDTO = {
        name: "Updated Chest Day",
      };

      const updatedWorkout = { ...mockWorkout, name: "Updated Chest Day" };

      (axiosClient.put as any).mockResolvedValue({ data: updatedWorkout });

      const result = await workoutApi.update("1", updateData);

      expect(axiosClient.put).toHaveBeenCalledWith("/workout/1", updateData);
      expect(result.data.name).toEqual("Updated Chest Day");
    });
  });

  describe("finishSession", () => {
    it("should finish a workout session", async () => {
      const finishedWorkout = { ...mockWorkout, status: "COMPLETED" };

      (axiosClient.put as any).mockResolvedValue({ data: finishedWorkout });

      const result = await workoutApi.finishSession("1");

      expect(axiosClient.put).toHaveBeenCalledWith("/workout/1/finish");
      expect(result.data.status).toEqual("COMPLETED");
    });
  });

  describe("cancelSession", () => {
    it("should cancel a workout session", async () => {
      const cancelledWorkout = { ...mockWorkout, status: "CANCELLED" };

      (axiosClient.put as any).mockResolvedValue({ data: cancelledWorkout });

      const result = await workoutApi.cancelSession("1");

      expect(axiosClient.put).toHaveBeenCalledWith("/workout/1/cancel");
      expect(result.data.status).toEqual("CANCELLED");
    });
  });

  describe("delete", () => {
    it("should delete a workout", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await workoutApi.delete("1");

      expect(axiosClient.delete).toHaveBeenCalledWith("/workout/1");
    });
  });

  describe("addExerciseToWorkout", () => {
    it("should add exercise to workout", async () => {
      const updatedWorkout = {
        ...mockWorkout,
        exercises: [{ id: "ex1", name: "Bench Press" }],
      };

      (axiosClient.put as any).mockResolvedValue({ data: updatedWorkout });

      const result = await workoutApi.addExerciseToWorkout("1", "ex1");

      expect(axiosClient.put).toHaveBeenCalledWith(
        "/workout/addexc/1/ex1"
      );
      expect(result.data.exercises.length).toBe(1);
    });
  });

  describe("addDefaultExerciseToWorkout", () => {
    it("should add default exercise template to workout", async () => {
      const updatedWorkout = {
        ...mockWorkout,
        exercises: [{ id: "ex1", name: "Default Bench Press" }],
      };

      (axiosClient.put as any).mockResolvedValue({ data: updatedWorkout });

      const result = await workoutApi.addDefaultExerciseToWorkout(
        "1",
        "template1"
      );

      expect(axiosClient.put).toHaveBeenCalledWith(
        "/workout/addexc/template/default/1/template1"
      );
      expect(result.data.exercises.length).toBe(1);
    });
  });

  describe("addUserExerciseToWorkout", () => {
    it("should add user-made exercise template to workout", async () => {
      const updatedWorkout = {
        ...mockWorkout,
        exercises: [{ id: "ex1", name: "Custom Exercise" }],
      };

      (axiosClient.put as any).mockResolvedValue({ data: updatedWorkout });

      const result = await workoutApi.addUserExerciseToWorkout(
        "1",
        "template1"
      );

      expect(axiosClient.put).toHaveBeenCalledWith(
        "/workout/addexc/template/usermade/1/template1"
      );
      expect(result.data.exercises.length).toBe(1);
    });
  });

  describe("removeExerciseFromWorkout", () => {
    it("should remove exercise from workout", async () => {
      (axiosClient.delete as any).mockResolvedValue({ data: mockWorkout });

      const result = await workoutApi.removeExerciseFromWorkout("1", "ex1");

      expect(axiosClient.delete).toHaveBeenCalledWith(
        "/workout/rmexc/1/ex1"
      );
      expect(result.data).toEqual(mockWorkout);
    });
  });
});
