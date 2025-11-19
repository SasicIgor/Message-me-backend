import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().trim().nonempty("Message is required"),
});
