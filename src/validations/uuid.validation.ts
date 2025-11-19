import { z } from "zod";

export const isUUID = z.uuid();

export const paramsSchema = z.object({
  chatId: isUUID,
  messageId: isUUID.optional(),
});
