import { type AuthenticatedRequest } from "../middleware/auth.ts";

export const getUserAndChat = (req: AuthenticatedRequest) => {
  return { userId: req.user!.id, chatId: req.params.chatId };
};
