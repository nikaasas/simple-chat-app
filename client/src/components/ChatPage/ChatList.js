import { useEffect, useState } from "react";
import socket from "../../socket";

export default function ChatList({ userInfos }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
  }, [socket, users]);
  return (
    <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
      <SearchBar />
      {users.map((user) =>
        userInfos?._id != user?._id ? (
          <ChatItem
            senderUserID={userInfos?._id}
            user={user}
            userName={user?.name + " " + user?.surname}
          />
        ) : null
      )}
    </div>
  );
}
function SearchBar() {
  return (
    <div class="border-b-2 py-4 px-2">
      <input
        type="text"
        placeholder="search chatting"
        class="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
      />
    </div>
  );
}
function ChatItem({ user, senderUserID, userName }) {
  
  const onUserClicked = () => {
    const recieverID = user?._id
    const roomID = [senderUserID, recieverID].sort().join("-");
    socket.emit("joinroom", roomID);
  };
  return (
    <div
      class="flex flex-row py-4 px-2 items-center border-b-2"
      onClick={onUserClicked}
    >
      <div class="w-1/4">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          class="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div class="w-full">
        <div class="text-lg font-semibold">{userName}</div>
        {/* <span class="text-gray-500">{message}</span> */}
      </div>
    </div>
  );
}
