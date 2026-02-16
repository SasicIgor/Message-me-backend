//returned type from  querying all chats
export type ChatBasicInfo = {
  id: string;
  name: string | null;
  isGroup: boolean;
  memberUsername?: string;
  memberId?: string | string[];
};

export type SingleChatBasic = Required<
  Pick<ChatBasicInfo, "id" | "memberId" | "memberUsername">
>;

//creating group chat
export type GroupChatBasicInfo = Required<
  Pick<ChatBasicInfo, "id" | "name" | "isGroup">
>;
