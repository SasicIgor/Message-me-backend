import {
  pgTable,
  varchar,
  uuid,
  boolean,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//users
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username").notNull().unique(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [uniqueIndex("username_idx").on(t.username)],
);

export const chat = pgTable(
  "chat",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).default("New Group"),
    isGroup: boolean("is_group").default(false).notNull(),
    lastUpdatedAt: timestamp("last_updated_at").defaultNow(),
    lastMessageId: uuid("last_message_id"),
    lastMessageSnippet: varchar("last_message_snippet", { length: 100 }),
  },
  (t) => [index("last_updated_at").on(t.lastUpdatedAt)],
);

export const chat_member = pgTable(
  "chat_member",
  {
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    chatId: uuid("chat_id")
      .references(() => chat.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.chatId] }),
    index("chat_member_chat_id_idx").on(t.chatId),
  ],
);

export const message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    chatId: uuid("chat_id")
      .references(() => chat.id, { onDelete: "cascade" })
      .notNull(),
    senderId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    content: varchar("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("msg_chat").on(t.chatId), index("created_at").on(t.createdAt)],
);

export const refreshToken = pgTable(
  "refresh_token",
  {
    hashedToken: varchar("hashed_token").primaryKey().notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => [uniqueIndex("refresh_token_idx").on(t.userId)],
);

//relations
export const userRelations = relations(users, ({ many }) => ({
  messages: many(message),
  chatMembers: many(chat_member),
}));

export const chatRelations = relations(chat, ({ many, one }) => ({
  messages: many(message),
  chatMembers: many(chat_member),
  lastMessage: one(message, {
    fields: [chat.lastMessageId],
    references: [message.id],
  }),
}));

export const chatMemberRelations = relations(chat_member, ({ one }) => ({
  user: one(users, {
    fields: [chat_member.userId],
    references: [users.id],
  }),
  chat: one(chat, {
    fields: [chat_member.chatId],
    references: [chat.id],
  }),
}));

export const messageRelations = relations(message, ({ one }) => ({
  user: one(users, {
    fields: [message.senderId],
    references: [users.id],
  }),
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
}));

export const refreshTokenRleations = relations(refreshToken, ({ one }) => ({
  user: one(users, {
    fields: [refreshToken.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Chat = typeof chat.$inferSelect;
export type Message = typeof message.$inferInsert;
export type ChatMember = typeof chat_member.$inferSelect;

// export const insertUserSchema = createInsertSchema(user);
// export const selectUser = createSelectSchema(user);
