import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosClient from "../axiosClient";
import { messageApi } from "./messageApi";
import type { MessageDto, CreateMessageDto } from "../../types/social/Message";

vi.mock("../axiosClient");

describe("messageApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockMessage: MessageDto = {
    id: "1",
    senderId: "user1",
    recipientId: "user2",
    content: "Hello!",
    timestamp: new Date(),
    read: false,
  };

  describe("getMessages", () => {
    it("should fetch messages between two users", async () => {
      const mockMessages = [mockMessage];

      (axiosClient.get as any).mockResolvedValue({ data: mockMessages });

      const result = await messageApi.getMessages("user1", "user2");

      expect(axiosClient.get).toHaveBeenCalledWith(
        "/message/user1/user2"
      );
      expect(result.data).toEqual(mockMessages);
    });

    it("should handle empty conversation", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: [] });

      const result = await messageApi.getMessages("user1", "user2");

      expect(result.data).toEqual([]);
    });
  });

  describe("create", () => {
    it("should create a new message", async () => {
      const messageData: CreateMessageDto = {
        senderId: "user1",
        recipientId: "user2",
        content: "Hello!",
      };

      (axiosClient.post as any).mockResolvedValue({ data: mockMessage });

      const result = await messageApi.create(messageData);

      expect(axiosClient.post).toHaveBeenCalledWith("/message", messageData);
      expect(result.data).toEqual(mockMessage);
    });

    it("should handle empty message content", async () => {
      const messageData: CreateMessageDto = {
        senderId: "user1",
        recipientId: "user2",
        content: "",
      };

      const error = new Error("Message content required");
      (axiosClient.post as any).mockRejectedValue(error);

      await expect(messageApi.create(messageData)).rejects.toThrow(
        "Message content required"
      );
    });
  });

  describe("getBySenderId", () => {
    it("should fetch all messages sent by a user", async () => {
      const mockMessages = [mockMessage];

      (axiosClient.get as any).mockResolvedValue({ data: mockMessages });

      const result = await messageApi.getBySenderId("user1");

      expect(axiosClient.get).toHaveBeenCalledWith("/message/bysender/user1");
      expect(result.data).toEqual(mockMessages);
    });

    it("should handle user with no sent messages", async () => {
      (axiosClient.get as any).mockResolvedValue({ data: [] });

      const result = await messageApi.getBySenderId("user1");

      expect(result.data).toEqual([]);
    });
  });

  describe("delete", () => {
    it("should delete a message", async () => {
      (axiosClient.delete as any).mockResolvedValue({});

      await messageApi.delete("1");

      expect(axiosClient.delete).toHaveBeenCalledWith("/message/1");
    });

    it("should handle deletion of non-existent message", async () => {
      const error = new Error("Message not found");
      (axiosClient.delete as any).mockRejectedValue(error);

      await expect(messageApi.delete("nonexistent")).rejects.toThrow(
        "Message not found"
      );
    });
  });
});
