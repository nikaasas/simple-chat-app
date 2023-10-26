const express = require("express");
const app = express();
const PORT = 4000;
const mongoose = require("mongoose");
const http = require("http").Server(app);
const cors = require("cors");
const MessageModel = require("./ChatSchema");


const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
mongoose.connect("mongodb://localhost:27017/chatss");

app.use(cors());
app.use(express.json());

const getMessagesHistory = async(roomID,senderID) => {
  try { 
    const room = await MessageModel.findOne(
      { roomID: roomID },
      { messages: 1 }
    );

    if (room && room.messages) {
      rooms[roomID].forEach((userSocketId) => {
        socketIO
          .to(userSocketId)
          .emit("messageResponse", {
            messages: room.messages,
            userID: senderID,
          });
      });
    }
  } catch (error) {
    console.error(error);
  }
}

let users = [];
const rooms = {};
socketIO.on("connection", (socket) => {
  socket.on("joinroom", (roomID) => {
    socket.join(roomID);
    socket.roomID = roomID;
    const senderID = socket.userID;
    if (!rooms[roomID]) rooms[roomID] = [];
    rooms[roomID].push(socket.id);
    getMessagesHistory(roomID,senderID)
  });

  socket.on("message", async (data) => {
    const roomID = socket.roomID;
    const senderID = socket.userID;
    const receiverID = roomID
      ? roomID.includes(senderID)
        ? roomID.replace(new RegExp(`-*${senderID}-*`), "")
        : null
      : null;

    if (roomID) {
      try {
        // Search for records by roomID
        const room = await MessageModel.findOne({ roomID: roomID });

        if (room) {
          // If there is a record for roomID, add new messages to the messages array and save
          room.messages.push({
            senderID: senderID,
            receiverID: receiverID,
            message: data.text,
          });
          const updatedRoom = await room.save();
          console.log("Mevcut kayıt güncellendi:", updatedRoom);
        } else {
          // If there is no record for roomID, create a new record
          const newRoom = new MessageModel({
            roomID: roomID,
            messages: [
              {
                senderID: senderID,
                receiverID: receiverID,
                message: data.text,
              },
            ],
          });
          const createdRoom = await newRoom.save();
          console.log("Yeni kayıt oluşturuldu:", createdRoom);
        }
      } catch (error) {
        console.error(error);
      }
      getMessagesHistory(roomID,senderID)
    }
  });

  socket.on("newUser", async (data) => {
    socket.userID = data?._id;
    const isInArray = users.some((user) => user._id === data._id);
    !isInArray ? users.push(data) : null;
    if (socket.userID) await socketIO.emit("newUserResponse", users);
  });

  socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

  socket.on("disconnect", () => {
    users = users.filter((user) => user._id !== socket.userID);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
