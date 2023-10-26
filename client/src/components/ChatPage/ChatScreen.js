import React, { useEffect, useState } from "react";
import socket from "../../socket";

export default function ChatScreen({ userInfos,roomID }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState("");
  useEffect(() => {

    socket.on("messageResponse", (data) => setMessages(data.messages));
    socket.on("typingResponse", (data) => setIsTyping(data));
    return () => {
      socket.off("messageResponse");
    };
  }, [socket, messages, isTyping]);

console.log(messages)
  return (
    <div class="w-full h-full px-5 flex flex-col justify-between relative">
      <div class="flex flex-col mt-5">
        {messages.map((message) => {
          return message?.senderID == userInfos?._id ? (
            <OutGoingMessage id={message?.id} text={message?.message} />
          ) : (
            <IncomingMessage id={message?.id} text={message?.message} />
          );
        })}
      </div>
      <p className="flex self-end text-sm">{isTyping}</p>
      <MessageInput socket={socket} roomID={roomID} userName={userInfos?.name + " " + userInfos?.surname} />
    </div>
  );
}

function OutGoingMessage({ text, id }) {
  return (
    <div key={id} class="flex justify-end mb-4">
      <div class="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
        {text}
      </div>
      <img
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        class="object-cover h-8 w-8 rounded-full"
        alt=""
      />
    </div>
  );
}

function IncomingMessage({ text, id }) {
  return (
    <div key={id} class="flex justify-start mb-4">
      <img
        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        class="object-cover h-8 w-8 rounded-full"
        alt=""
      />
      <div class="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
        {text}
      </div>
    </div>
  );
}

function MessageInput({ socket, userName }) {
  const [input, setInput] = useState("");
  const onInputChanged = (e) => setInput(e.target.value);
  useEffect(() => {
    input
      ? socket.emit("typing", `${userName} is typing...`)
      : socket.emit("typing", "");
  }, [input]);
  const handleSendMessage = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      if (input.trim() && userName) {
        socket.emit("message", {
          text: input,
          name: userName,
          id: `${socket.id}${Math.random()}`,
          socketID: socket.id,
        });
      }
      setInput("");
    }
  };

  return (
    <div class="py-5 flex">
      <input
        onChange={onInputChanged}
        class="w-full bg-gray-300 py-5 px-3 rounded-xl"
        type="text"
        value={input}
        onKeyDown={handleSendMessage}
        placeholder="type your message here..."
      />
    </div>
  );
}
