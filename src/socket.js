// src/socket.js
let ioInstance;

module.exports = {
  init: (httpServer) => {
    const { Server } = require("socket.io");
    ioInstance = new Server(httpServer, {
      cors: { origin: "*" },
    });

    ioInstance.on("connection", (socket) => {
      console.log("New user connected", socket.id);

      socket.on("send_message", (data) => {
        ioInstance.to(data.roomId).emit("receive_message", data);
      });

      socket.on("join_room", ({ groupId }) => {
        socket.join(groupId);
      });
    });

    return ioInstance;
  },
  getIO: () => {
    if (!ioInstance) {
      throw new Error("Socket.io not initialized yet");
    }
    return ioInstance;
  },
};
