import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { addChat, setChats } from "@/redux/chatSlice";
import { setSelectedChat } from "@/redux/selectedChat";
import axios from "axios";
import { useEffect } from "react";

// const chats = [
//   { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=32&width=32', status: 'online' },
//   { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=32&width=32', status: 'offline' },
//   { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=32&width=32', status: 'online' },
//   { id: 4, name: 'Diana Prince', avatar: '/placeholder.svg?height=32&width=32', status: 'away' },
// ]

export default function UserList() {
  const chats = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { _id: userId } = useAppSelector((state) => state.user);

  const getAllChats = async () => {
    const res = await axios.get(
      "http://localhost:3000/chat",

      {
        params: { userId }, // Query parameters

        withCredentials: true,
      }
    );

    console.log(res.data);
    dispatch(setChats(res.data));
  };

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat._id}
            onClick={() => dispatch(setSelectedChat(chat))}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Avatar>
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              <AvatarFallback>
                {chat.groupName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{chat.groupName}</p>
              {/* <p className="text-sm text-gray-500">{user.status}</p> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
