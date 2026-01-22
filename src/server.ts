import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "#features/users/user.routes.ts";
import authRoutes from "#features/auth/auth.routes.ts";
import messageRouter from "#features/messages/message.routes.ts";
import chatRouter from "#features/chats/chat.routes.ts";

import { errorMiddleware } from "#middleware/error.middleware.ts";

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("connected user");

  socket.on("disconnect", () => {
    console.log("disconnected user");
  });
});
//global middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/chats", chatRouter);

//error handler
app.use(errorMiddleware);
export default app;
