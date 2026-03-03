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
import { initSocket, type IOServer } from "./socket/socket.ts";
import { registerSockets } from "#socket/index.ts";
import { UnauthorizedError } from "#errors/unauthorized.error.ts";
import { verifyToken } from "#utils/jwt.ts";
import { errors } from "jose";

const app = express();
const httpServer = createServer(app);

const io: IOServer = new Server(httpServer, {
  cors: {
    origin: [process.env.CLIENT_URL as string],
    methods: ["GET", "POST"],
  },
});

initSocket(io);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new UnauthorizedError("Unauthorized socket denied!");
    const user = await verifyToken(token, "access");
    socket.data.user = user;
    console.log("USER ON SOCKET: ", socket.data);
    next();
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      console.log("error in socket middleware");
      return next(new UnauthorizedError("Refresh the access token!"));
    }
    if (error instanceof Error) next(error);
    throw new Error("Error occured in socket middleware!");
  }
});

io.use((socket, next) => {
  const transport = socket.conn.transport.name;
  console.log(`Socket ${socket.id} is using: ${transport}`);
  next();
});

io.on("connection", (socket) => {
  console.log("[!!! CONNECTED USER !!!]: ", socket.id);
  //join users to the room of their ID
  socket.join(socket.data.user.id);
  registerSockets(socket);

  socket.on("disconnect", () => {
    console.log("disconnected user");
  });
});
//global middleware
app.use(helmet());
app.use(
  cors({
    origin: [process.env.CLIENT_URL as string],
    credentials: true,
  }),
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
export { httpServer, io };
