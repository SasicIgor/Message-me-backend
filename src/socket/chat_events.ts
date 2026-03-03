import { Socket } from "socket.io";

export const chatSocket = (socket: Socket) => {
  socket.on("chat:join_room", (chatId: string) => {
    console.log("hey, i'm joining this room: ", chatId);
    socket.join(chatId);
  });

  socket.on("chat:leave_room", (chatId: string) => {
    console.log("hey, i left the room: ", chatId);
    socket.leave(chatId);
  });

  socket.on(
    "chat:user_typing",
    ({ username, chatId }: { username: string; chatId: string }) => {
      console.log(`${username} is typing in room ${chatId}`);
      socket.to(chatId).emit("chat:user_typing", { username, chatId });
    },
  );
};
