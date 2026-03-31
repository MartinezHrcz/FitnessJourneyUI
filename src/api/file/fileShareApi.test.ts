import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../axiosClient.ts", () => ({
    default: {
        get: vi.fn(),
    },
}));

import axiosClient from "../axiosClient.ts";
import { fileShareApi } from "./fileShareApi.ts";

const mockedGet = vi.mocked(axiosClient.get);

describe("fileShareApi.getFile", () => {
    beforeEach(() => {
        mockedGet.mockReset();
    });

    it("returns null payload on 204 response", async () => {
        mockedGet.mockResolvedValue({
            status: 204,
            data: null,
            headers: {},
        } as any);

        const result = await fileShareApi.getFile("/api/user/profile-picture/me");

        expect(mockedGet).toHaveBeenCalledWith("/user/profile-picture/me", {
            responseType: "blob",
            validateStatus: expect.any(Function),
        });
        expect(result.data).toBeNull();
    });

    it("returns original url for absolute http urls", async () => {
        const url = "https://cdn.example.com/avatar.png";

        const result = await fileShareApi.getFile(url);

        expect(mockedGet).not.toHaveBeenCalled();
        expect(result.data).toBe(url);
    });

    it("calls legacy files endpoint for plain filename", async () => {
        const imageBlob = new Blob(["a"], { type: "image/png" });
        mockedGet.mockResolvedValue({
            status: 200,
            data: imageBlob,
            headers: { "content-type": "image/png" },
        } as any);

        await fileShareApi.getFile("profile pic.png");

        expect(mockedGet).toHaveBeenCalledWith("/files/profile%20pic.png", {
            responseType: "blob",
            validateStatus: expect.any(Function),
        });
    });

    it("normalizes non-image blob response to null", async () => {
        const textBlob = new Blob(["not image"], { type: "text/plain" });
        mockedGet.mockResolvedValue({
            status: 200,
            data: textBlob,
            headers: { "content-type": "text/plain" },
        } as any);

        const result = await fileShareApi.getFile("avatar.txt");

        expect(result.data).toBeNull();
    });
});
