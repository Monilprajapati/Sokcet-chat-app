import express from "express";
import http from "http";
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io";
import cors from "cors";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let users = [];

let messages = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("join server", (username) => {
    const user = {
      username,
      id: socket.id,
    };
    users.push(user);
    io.emit("new user", user);
    console.log("new user", user);
  });

  socket.on("join room", (roomName, cb) => {
    socket.join(roomName);
    cb(messages[roomName]);
  });

  // socket.on("get users", (cb) => {
  //   cb(users);
  // });

  // socket.on("get messages", (chatName, cb) => {
  //   if (typeof cb === 'function') {
  //     cb(messages[chatName]);
  //   } else {
  //     console.error('Callback is not a function.');
  //   }
  // });

  // socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
  //   if (isChannel) {
  //     const payload = {
  //       content,
  //       chatName,
  //       sender,
  //     };
  //     socket.to(to).emit("new message", payload);
  //   } else {
  //     const payload = {
  //       content,
  //       chatName: sender,
  //       sender,
  //     };
  //     socket.to(to).emit("new message", payload);
  //   }

  //   if (messages[chatName]) {
  //     messages[chatName].push({ sender, content });
  //   }
  // });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);
    io.emit("new user", users);
  });
});

const PORT = 3200;

server.listen(PORT, () => {
  console.log("listening on ", PORT);
});
