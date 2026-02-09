import { Socket } from "socket.io";
import { chatSocket } from "./chat_events.ts";

export const registerSockets = (socket: Socket) => {
  chatSocket(socket);
};
