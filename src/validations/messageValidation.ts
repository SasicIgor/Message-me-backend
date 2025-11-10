import { z } from "zod";

export const createMsgSchema = z.object({
  content: z.string().trim().nonempty("Message Content is required"),
});
export const deleteMsgSchema = z.object({
  id: z.string().trim().nonempty("Message ID is required"),
});

export const editMsgSchema = z.object({
  id: z.string().trim().nonempty("Message ID is required"),
  content: z.string().trim().nonempty("Message Content is required"),
});
