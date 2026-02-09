import { Socket } from "socket.io";

export const chatSocket = (socket: Socket) => {
  socket.on("chat:join_many", (chatIds: string[], callback) => {
    console.log("hey, i'm joining these rooms: ", chatIds);
    socket.join(chatIds);
    callback("ok");
  });

  socket.on(
    "chat:user_typing",
    ({ username, chatId }: { username: string; chatId: string }) => {
      console.log(`${username} is typing in room ${chatId}`);
      socket.to(chatId).emit("chat:user_typing", { username, chatId });
    },
  );
};
