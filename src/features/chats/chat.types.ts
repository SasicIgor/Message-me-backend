//returned type from  querying all chats
export type ChatBasicInfo = {
  id: string;
  name: string | null;
  isGroup: boolean;
  memberUsername?: string | null;
  memberId?: string | string[] | null;
  lastMessageSnippet?: string | null;
  lastMessageId?: string | null;
};
