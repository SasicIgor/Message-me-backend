import { UnauthorizedError } from "#errors/unauthorized.error.ts";
import { type JWTPayload } from "#utils/jwt.ts";
import { type DefaultEventsMap, Server } from "socket.io";

type SocketUser = { user: JWTPayload };
export type IOServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketUser
>;

let io: IOServer;

export const initSocket = (server: IOServer) => {
  io = server;
};

export const getIO = (): IOServer => {
  if (!io) throw new UnauthorizedError("Unauthorized access denied!");
  return io;
};
