//returned type from  querying all chats
export type ChatBasicInfo = {
  chatId: string;
  name: string | null;
  isGroup: boolean;
  memberUsername?: string;
  memberId?: string;
};

export type SingleChatBasic = Required<
  Pick<ChatBasicInfo, "chatId" | "memberId" | "memberUsername">
>;
