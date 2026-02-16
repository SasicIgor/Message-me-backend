//returned type from  querying all chats
export type ChatBasicInfo = {
  id: string;
  name: string | null;
  isGroup: boolean;
  memberUsername?: string | null;
  memberId?: string | string[] | null;
};

export type SingleChatBasic = Required<
  Pick<ChatBasicInfo, "id" | "memberId" | "memberUsername">
>;

//creating group chat
export type GroupChatBasicInfo = Required<
  Pick<ChatBasicInfo, "id" | "name" | "isGroup">
>;
