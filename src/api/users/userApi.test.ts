import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../axiosClient.ts", () => ({
    default: {
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

import axiosClient from "../axiosClient.ts";
import { userApi } from "./userApi.ts";

const mockedGet = vi.mocked(axiosClient.get);
const mockedPut = vi.mocked(axiosClient.put);
const mockedPost = vi.mocked(axiosClient.post);
const mockedDelete = vi.mocked(axiosClient.delete);

describe("userApi", () => {
    beforeEach(() => {
        mockedGet.mockReset();
        mockedPut.mockReset();
        mockedPost.mockReset();
        mockedDelete.mockReset();
    });

    it("calls search endpoint with params", async () => {
        mockedGet.mockResolvedValue({ data: [] } as any);

        await userApi.getUserSearch({ id: "u1" });

        expect(mockedGet).toHaveBeenCalledWith("/user/search", { params: { id: "u1" } });
    });

    it("uploads profile picture as multipart form-data", async () => {
        mockedPost.mockResolvedValue({ data: {} } as any);
        const file = new File(["img"], "avatar.png", { type: "image/png" });

        await userApi.updateProfilePicture(file);

        expect(mockedPost).toHaveBeenCalledTimes(1);
        const [url, body, config] = mockedPost.mock.calls[0];
        expect(url).toBe("/user/profile-picture");
        expect(body).toBeInstanceOf(FormData);
        expect((body as FormData).get("image")).toBe(file);
        expect(config).toEqual({ headers: { "Content-Type": "multipart/form-data" } });
    });

    it("calls update password endpoint with user id", async () => {
        mockedPut.mockResolvedValue({ data: {} } as any);

        await userApi.updatePassword("abc", { oldPassword: "old", newPassword: "new" });

        expect(mockedPut).toHaveBeenCalledWith("/user/pwd/abc", {
            oldPassword: "old",
            newPassword: "new",
        });
    });

    it("calls delete user endpoint", async () => {
        mockedDelete.mockResolvedValue({ data: "Deleted" } as any);

        await userApi.deleteUser("abc");

        expect(mockedDelete).toHaveBeenCalledWith("/user/abc");
    });
});
