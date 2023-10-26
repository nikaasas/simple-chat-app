import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader.js";
import ChatList from "./ChatList.js";
import ChatScreen from "./ChatScreen.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../../socket.js";

export default function ChatPage() {
  const navigate = useNavigate();
  const [userInfos, setUserInfos] = useState({
    _id: "",
    name: "",
    surname: "",
    email: "",
  });
  useEffect(() => {
    axios.get("http://localhost:3001/getuser", { withCredentials: true }).then(
      (res) => setUserInfos(res?.data),
      (err) => (err ? navigate("/signup") : null)
    );
  }, []);

  useEffect(() => {
    if (userInfos?._id) {
      socket.connect();
      socket.emit("newUser", userInfos);
    }
  }, [userInfos]);

  return (
    <div class="container mx-auto h-full shadow-lg rounded-lg">
      <ChatHeader
        userName={userInfos?.name + " " + userInfos?.surname}
        photoName={userInfos?.name[0] + userInfos?.surname[0]}
      />
      <ChatBody userInfos={userInfos} />
    </div>
  );
}

function ChatBody({ userInfos }) {
  return (
    <div class="flex flex-row justify-between bg-white">
      <ChatList userInfos={userInfos}/>
      <ChatScreen userInfos={userInfos}/>
    </div>
  );
}
