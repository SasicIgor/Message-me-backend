import { type AuthenticatedRequest } from "#middleware/auth.middleware.ts";

export const getUserAndChat = (req: AuthenticatedRequest) => {
  return {
    userId: req.user!.id,
    username: req.user!.username,
    chatId: req.params.chatId,
    //messageId will be undefiend for create and get
    messageId: req.params.messageId,
  };
};
