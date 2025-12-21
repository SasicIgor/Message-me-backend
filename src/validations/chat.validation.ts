import { z } from "zod";

import { isUUID } from "./uuid.validation.ts";

export const getOrCreatePrivateChatSchema = z.object({
  memberId: isUUID,
});
export const createGroupChatSchema = z.object({
  memberIds: isUUID.array().nonempty(),
  name: z.string().trim(),
});
export const updateChatNameSchema = z.object({
  name: z.string().trim().nonempty(),
});
export const updateChatMembersSchema = z.object({
  memberId: isUUID,
});
