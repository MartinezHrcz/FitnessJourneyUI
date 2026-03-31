import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { commentApi } from "./commentApi";
import type { CommentDTO, CommentCreateDTO } from "../../types/social/Comment";

vi.mock("../axiosClient");

describe("commentApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should fetch all comments", async () => {
      const mockComments: CommentDTO[] = [
        {
          id: "1",
          content: "Great post!",
          userId: "user1",
          postId: "post1",
          createdAt: new Date(),
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockComments });

      const result = await commentApi.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith("/comment");
      expect(result.data).toEqual(mockComments);
    });
  });

  describe("getById", () => {
    it("should fetch comment by id", async () => {
      const mockComment: CommentDTO = {
        id: "1",
        content: "Great post!",
        userId: "user1",
        postId: "post1",
        createdAt: new Date(),
      };

      (axiosClient.get as any).mockResolvedValue({ data: mockComment });

      const result = await commentApi.getById("1");

      expect(axiosClient.get).toHaveBeenCalledWith("/comment/1");
      expect(result.data).toEqual(mockComment);
    });
  });

  describe("getByPostId", () => {
    it("should fetch comments by post id", async () => {
      const mockComments: CommentDTO[] = [
        {
          id: "1",
          content: "Comment 1",
          userId: "user1",
          postId: "post1",
          createdAt: new Date(),
        },
        {
          id: "2",
          content: "Comment 2",
          userId: "user2",
          postId: "post1",
          createdAt: new Date(),
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockComments });

      const result = await commentApi.getByPostId("post1");

      expect(axiosClient.get).toHaveBeenCalledWith("/comment/post/post1");
      expect(result.data).toEqual(mockComments);
      expect(result.data.length).toBe(2);
    });
  });

  describe("getByUserId", () => {
    it("should fetch comments by user id", async () => {
      const mockComments: CommentDTO[] = [
        {
          id: "1",
          content: "My comment",
          userId: "user1",
          postId: "post1",
          createdAt: new Date(),
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockComments });

      const result = await commentApi.getByUserId("user1");

      expect(axiosClient.get).toHaveBeenCalledWith("/comment/user/user1");
      expect(result.data).toEqual(mockComments);
    });
  });

  describe("getByPostAndUser", () => {
    it("should fetch comments by post and user", async () => {
      const mockComments: CommentDTO[] = [
        {
          id: "1",
          content: "My comment on post",
          userId: "user1",
          postId: "post1",
          createdAt: new Date(),
        },
      ];

      (axiosClient.get as any).mockResolvedValue({ data: mockComments });

      const result = await commentApi.getByPostAndUser("post1", "user1");

      expect(axiosClient.get).toHaveBeenCalledWith(
        "/comment/post/post1/user/user1"
      );
      expect(result.data).toEqual(mockComments);
    });
  });

  describe("create", () => {
    it("should create a new comment", async () => {
      const commentData: CommentCreateDTO = {
        content: "New comment",
      };

      const mockComment: CommentDTO = {
        id: "new1",
        content: "New comment",
        userId: "user1",
        postId: "post1",
        createdAt: new Date(),
      };

      (axiosClient.post as any).mockResolvedValue({ data: mockComment });

      const result = await commentApi.create(commentData, "post1", "user1");

      expect(axiosClient.post).toHaveBeenCalledWith(
        "/comment/post/post1/user/user1",
        commentData
      );
      expect(result.data).toEqual(mockComment);
    });
  });

  describe("update", () => {
    it("should update a comment", async () => {
      const updatedComment: CommentDTO = {
        id: "1",
        content: "Updated content",
        userId: "user1",
        postId: "post1",
        createdAt: new Date(),
      };

      (axiosClient.put as any).mockResolvedValue({ data: updatedComment });

      const result = await commentApi.update("1", "Updated content");

      expect(axiosClient.put).toHaveBeenCalledWith("/comment/1", "Updated content", {
        headers: { "Content-Type": "text/plain" },
      });
      expect(result.data).toEqual(updatedComment);
    });
  });

  describe("delete", () => {
    it("should delete a comment", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await commentApi.delete("1");

      expect(axiosClient.delete).toHaveBeenCalledWith("/comment/1");
    });
  });
});
