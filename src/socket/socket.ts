import { UnauthorizedError } from "#errors/unauthorized.error.ts";
import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: Server) => {
  io = server;
};

export const getIO = (): Server => {
  if (!io) throw new UnauthorizedError("Unauthorized access denied!");
  return io;
};
