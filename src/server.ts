import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import authRoutes from "./auth/auth.routes.ts";
import messageRouter from "./messages/message.routes.ts";
import { errorMiddleware } from "./middleware/error.middleware.ts";
const app = express();

//global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", messageRouter);

//error handler
app.use(errorMiddleware)
export default app;
