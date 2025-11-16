//returned type from  querying all chats
export type ChatInfo = {
  chatId: string;
  name: string | null;
  isGroup: boolean;
  memberUsername?: string;
};
