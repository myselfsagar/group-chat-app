const express = require("express");
require("dotenv").config();
const mainRoutes = require("./routes/index");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const Message = require("./models/Message");

const io = new Server(http, {
  cors: {
    origin: "*",
  },
});

//Socket logic
io.on("connection", (socket) => {
  console.log("New user connected", socket.id);

  socket.on("send_message", (messageData) => {
    io.to(messageData.roomId).emit("receive_message", messageData);
  });

  socket.on("join_room", async ({ groupId }) => {
    socket.join(groupId);
  });
});

//connect to db
const dbConnect = require("./utils/dbConnect");
require("./models/index");

//middlewares
app.use(express.json());
app.use(express.static("src/public"));

//routes
app.use(mainRoutes);

//connect to the server
(async () => {
  try {
    await dbConnect.sync({ force: false });
    const PORT = process.env.PORT || 5000;
    http.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
