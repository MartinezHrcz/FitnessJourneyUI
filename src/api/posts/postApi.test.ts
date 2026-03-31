import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { postApi } from "./postApi";
import type { PostDto, PostCreateDto, PostUpdateDto } from "../../types/social/Post";

vi.mock("../axiosClient");

describe("postApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPost: PostDto = {
    id: "1",
    title: "My Workout",
    content: "Great session today!",
    userId: "user1",
    userName: "John",
    userProfilePictureUrl: "avatar.png",
    imageUrl: null,
    visibility: "PUBLIC",
    sentTime: new Date(),
    likeCount: 5,
    commentCount: 2,
    likedByCurrentUser: false,
    comments: [],
  };

  describe("getAll", () => {
    it("should fetch all posts", async () => {
      const mockPosts = [mockPost];

      (axiosClient.get as any).mockResolvedValue({ data: mockPosts });

      const result = await postApi.getAll();

      expect(axiosClient.get).toHaveBeenCalledWith("/post");
      expect(result.data).toEqual(mockPosts);
    });
  });

  describe("getFeed", () => {
    it("should fetch user's feed", async () => {
      const mockPosts = [mockPost];

      (axiosClient.get as any).mockResolvedValue({ data: mockPosts });

      const result = await postApi.getFeed();

      expect(axiosClient.get).toHaveBeenCalledWith("/post/feed");
      expect(result.data).toEqual(mockPosts);
    });
  });

  describe("getFriendsPosts", () => {
    it("should fetch friends' posts", async () => {
      const mockPosts = [mockPost];

      (axiosClient.get as any).mockResolvedValue({ data: mockPosts });

      const result = await postApi.getFriendsPosts();

      expect(axiosClient.get).toHaveBeenCalledWith("/post/friends");
      expect(result.data).toEqual(mockPosts);
    });
  });

  describe("getByUserId", () => {
    it("should fetch posts by user id", async () => {
      const mockPosts = [mockPost];

      (axiosClient.get as any).mockResolvedValue({ data: mockPosts });

      const result = await postApi.getByUserId("user1");

      expect(axiosClient.get).toHaveBeenCalledWith("/post/user/user1");
      expect(result.data).toEqual(mockPosts);
    });
  });

  describe("create", () => {
    it("should create a new post", async () => {
      const postData: PostCreateDto = {
        title: "My Workout",
        content: "Great session!",
        visibility: "PUBLIC",
      };

      (axiosClient.post as any).mockResolvedValue({ data: mockPost });

      const result = await postApi.create(postData);

      expect(axiosClient.post).toHaveBeenCalledWith("/post", postData);
      expect(result.data).toEqual(mockPost);
    });
  });

  describe("createWithImage", () => {
    it("should create a post with an image", async () => {
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });
      const content = "Check out my progress!";

      (axiosClient.post as any).mockResolvedValue({ data: mockPost });

      const result = await postApi.createWithImage(content, file);

      expect(axiosClient.post).toHaveBeenCalled();
      const call = (axiosClient.post as any).mock.calls[0];
      expect(call[0]).toBe("/post/with-image");
      expect(call[2]?.headers["Content-Type"]).toBe("multipart/form-data");
      expect(result.data).toEqual(mockPost);
    });

    it("should create a post without image", async () => {
      const content = "Check out my progress!";

      (axiosClient.post as any).mockResolvedValue({ data: mockPost });

      const result = await postApi.createWithImage(content);

      expect(axiosClient.post).toHaveBeenCalled();
      expect(result.data).toEqual(mockPost);
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const updateData: PostUpdateDto = {
        title: "Updated Title",
        content: "Updated content",
        visibility: "FRIENDS_ONLY",
      };

      const updatedPost = { ...mockPost, ...updateData };

      (axiosClient.put as any).mockResolvedValue({ data: updatedPost });

      const result = await postApi.update("1", updateData);

      expect(axiosClient.put).toHaveBeenCalledWith("/post/1", updateData);
      expect(result.data.title).toEqual("Updated Title");
    });
  });

  describe("like", () => {
    it("should like a post", async () => {
      (axiosClient.post as any).mockResolvedValue({});

      await postApi.like("1");

      expect(axiosClient.post).toHaveBeenCalledWith("/post/1/like");
    });
  });

  describe("delete", () => {
    it("should delete a post", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await postApi.delete("1");

      expect(axiosClient.delete).toHaveBeenCalledWith("/post/1");
    });
  });
});
