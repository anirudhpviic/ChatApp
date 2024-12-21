import { apiClient } from "@/api/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocketContext } from "@/context/SocketContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import useSocket from "@/hooks/useSocket";
import { addMessage, setMessages } from "@/redux/messageSlice";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

// const messages = [
//   {
//     id: 1,
//     sender: "Alice Johnson",
//     content: "Hey, how are you?",
//     timestamp: "10:00 AM",
//   },
//   {
//     id: 2,
//     sender: "You",
//     content: "Im doing great, thanks! How about you?",
//     timestamp: "10:05 AM",
//   },
//   {
//     id: 3,
//     sender: "Alice Johnson",
//     content: "Pretty good! Just working on some projects.",
//     timestamp: "10:10 AM",
//   },
//   {
//     id: 4,
//     sender: "You",
//     content: "That sounds interesting. What kind of projects?",
//     timestamp: "10:15 AM",
//   },
// ];

export default function MessageList() {
  // const socket = useSocket();
  const { socket } = useSocketContext();

  const [message, setMessage] = useState("");

  const selectedChat = useAppSelector((state) => state.selectedChat);
  const messages = useAppSelector((state) => state.message);
  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (message) => {
      console.log("Message received:", message);
      dispatch(addMessage(message));
      // setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, dispatch]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("sendMessage", {
        groupId: selectedChat._id,
        message,
        senderId: user._id,
      });
      setMessage(""); // Clear input
    }
  };

  const fetchAllMessages = async () => {
    const response = await apiClient.get("/message", {
      params: { groupId: selectedChat._id },
    });

    dispatch(setMessages(response.data));
    console.log("data", response.data);
  };

  useEffect(() => {
    fetchAllMessages();
  }, [selectedChat]);

  // if (selectedChat.isSelected === false) return;

  const getUsername = (senderId) => {
    console.log("senderId", senderId);
    console.log("selectedChat", selectedChat);
    const oppositeUser = selectedChat.participants.find(
      (p) => p._id === senderId
    );
    return oppositeUser?.username || "oppo";
    // return "d"
  };

  const getOppositeUserOne = () => {
    const oppositeUser = selectedChat.participants.find(
      (p) => p._id !== user._id
    );
    return oppositeUser?.username || "oppo";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">
          Messages -{" "}
          {selectedChat.type === "group"
            ? selectedChat.groupName
            : getOppositeUserOne()}
        </h2>
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message._id}
              className={`flex ${
                message.sender === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[70%] ${
                  message.sender === user._id
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {message.sender !== user._id && (
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={message.sender}
                    />
                    <AvatarFallback>
                      {/* {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")} */}
                      {getUsername(message.sender)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg  ${
                    message.sender === user._id ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <p className="font-medium">
                    {message.sender === user._id
                      ? "You"
                      : getUsername(message.sender)}
                  </p>
                  <p>{message.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {/* {message.timestamp} */}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t">
        <form className="flex space-x-2" onSubmit={sendMessage}>
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
