import { z } from "zod";

export const createMsgSchema = z.object({
  content: z.string().trim().nonempty("Message Content is required"),
});

export const editMsgSchema = z.object({
  content: z.string().trim().nonempty("Message Content is required"),
});
