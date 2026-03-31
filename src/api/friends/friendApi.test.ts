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
import { friendApi } from "./friendApi.ts";

const mockedGet = vi.mocked(axiosClient.get);
const mockedPut = vi.mocked(axiosClient.put);
const mockedPost = vi.mocked(axiosClient.post);
const mockedDelete = vi.mocked(axiosClient.delete);

describe("friendApi", () => {
    beforeEach(() => {
        mockedGet.mockReset();
        mockedPut.mockReset();
        mockedPost.mockReset();
        mockedDelete.mockReset();
    });

    it("loads all friends", async () => {
        mockedGet.mockResolvedValue({ data: [] } as any);

        await friendApi.getAll();

        expect(mockedGet).toHaveBeenCalledWith("/friend");
    });

    it("loads friends for specific user", async () => {
        mockedGet.mockResolvedValue({ data: [] } as any);

        await friendApi.getFriendsOfUser("u1");

        expect(mockedGet).toHaveBeenCalledWith("/friend/user/u1");
    });

    it("creates a friend request", async () => {
        mockedPost.mockResolvedValue({ data: {} } as any);

        await friendApi.create({ userId: "u1", friendId: "u2" });

        expect(mockedPost).toHaveBeenCalledWith("/friend", { userId: "u1", friendId: "u2" });
    });

    it("accepts a friend request", async () => {
        mockedPut.mockResolvedValue({ data: {} } as any);

        await friendApi.acceptRequest("rel1");

        expect(mockedPut).toHaveBeenCalledWith("/friend/rel1/accept");
    });

    it("deletes a friend relation", async () => {
        mockedDelete.mockResolvedValue({ data: {} } as any);

        await friendApi.delete("rel1");

        expect(mockedDelete).toHaveBeenCalledWith("/friend/rel1");
    });
});
