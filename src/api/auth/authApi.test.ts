import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { authApi } from "./authApi";
import type { createUser, authRequest, refreshTokenRequest } from "../../types/Auth";

vi.mock("../axiosClient");

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should call post with correct endpoint and data", async () => {
      const userData: createUser = {
        email: "test@example.com",
        password: "password123",
        userName: "testuser",
      };

      const mockResponse = {
        data: {
          accessToken: "token123",
          refreshToken: "refresh123",
          userId: "123",
        },
      };

      (axiosClient.post as any).mockResolvedValue(mockResponse);

      const result = await authApi.registerUser(userData);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/register", userData);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("should handle registration errors", async () => {
      const userData: createUser = {
        email: "test@example.com",
        password: "pass",
        userName: "testuser",
      };

      const error = new Error("Registration failed");
      (axiosClient.post as any).mockRejectedValue(error);

      await expect(authApi.registerUser(userData)).rejects.toThrow(
        "Registration failed"
      );
    });
  });

  describe("login", () => {
    it("should call post with correct endpoint and credentials", async () => {
      const credentials: authRequest = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse = {
        data: {
          accessToken: "token123",
          refreshToken: "refresh123",
          userId: "123",
        },
      };

      (axiosClient.post as any).mockResolvedValue(mockResponse);

      const result = await authApi.login(credentials);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/login", credentials);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("should handle invalid credentials", async () => {
      const credentials: authRequest = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const error = new Error("Invalid credentials");
      (axiosClient.post as any).mockRejectedValue(error);

      await expect(authApi.login(credentials)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("refresh", () => {
    it("should call post with correct endpoint and refresh token", async () => {
      const refreshData: refreshTokenRequest = {
        refreshToken: "refresh123",
      };

      const mockResponse = {
        data: {
          accessToken: "newToken123",
          refreshToken: "newRefresh123",
          userId: "123",
        },
      };

      (axiosClient.post as any).mockResolvedValue(mockResponse);

      const result = await authApi.refresh(refreshData);

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/refresh", refreshData);
      expect(result.data).toEqual(mockResponse.data);
    });

    it("should handle expired refresh token", async () => {
      const refreshData: refreshTokenRequest = {
        refreshToken: "expired_token",
      };

      const error = new Error("Refresh token expired");
      (axiosClient.post as any).mockRejectedValue(error);

      await expect(authApi.refresh(refreshData)).rejects.toThrow(
        "Refresh token expired"
      );
    });
  });
});
