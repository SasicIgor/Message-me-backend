import { type AuthenticatedRequest } from "../middleware/auth.middleware.ts";

export const getUserAndChat = (req: AuthenticatedRequest) => {
  return { userId: req.user!.id, chatId: req.params.chatId };
};
