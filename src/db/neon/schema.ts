import {
  pgTable,
  varchar,
  uuid,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username").notNull().unique(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }),
  isGroup: boolean("is_group").notNull(),
});

export const chat_member = pgTable("chat_member", {
  userId: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  chatId: uuid("chat_id")
    .references(() => chat.id)
    .notNull(),
});

export const message = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .references(() => chat.id)
    .notNull(),
  senderId: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//relations
export const userRelations = relations(user, ({ many }) => ({
  messages: many(message),
  chatMembers: many(chat_member),
}));

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message),
  chatMembers: many(chat_member),
}));

export const chatMemberRelations = relations(chat_member, ({ one }) => ({
  user: one(user, {
    fields: [chat_member.userId],
    references: [user.id],
  }),
  chat: one(chat, {
    fields: [chat_member.chatId],
    references: [chat.id],
  }),
}));

export const messageRelations = relations(message, ({ one }) => ({
  user: one(user, {
    fields: [message.senderId],
    references: [user.id],
  }),
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
}));
