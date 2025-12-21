import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./users/user.routes.ts";
import messageRouter from "./messages/message.routes.ts";
import chatRouter from "./chats/chat.routes.ts";

import { errorMiddleware } from "./middleware/error.middleware.ts";
const app = express();

//global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/chats", chatRouter);

//error handler
app.use(errorMiddleware);
export default app;
