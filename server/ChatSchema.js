const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    roomID: {
      type: String,
      required: true,
    },
    messages: [
      {
        senderID: {
          type: String,
          required: true,
        },
        receiverID: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
  }
  );
  
  const MessageModel = mongoose.model("messages", ChatSchema)
    module.exports = MessageModel;