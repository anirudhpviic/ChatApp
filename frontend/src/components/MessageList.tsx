import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocketContext } from "@/context/SocketContext";
import useGetAllMessages from "@/hooks/messages/useGetAllMessages";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { Send, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient } from "@/api/config";
import { addMessage } from "@/redux/messageSlice";

const names = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Ross",
  "Ethan Hunt",
];

export default function MessageList() {
  const { socket } = useSocketContext();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const { loading, error } = useGetAllMessages();

  const selectedChat = useAppSelector((state) => state.selectedChat);
  const messages = useAppSelector((state) => state.message);
  const user = useAppSelector((state) => state.user);

  const [readByArr, setReadByArr] = useState([]);

  const dispatch = useAppDispatch();

  if (loading) return <div>Loading messages...</div>;
  // if (error) return <div>{error}</div>;

  // Handle text message sending
  const sendTextMessage = async (e) => {
    e.preventDefault();
    if (socket && message.trim() && selectedChat.type !== "broadcast") {
      socket.emit("sendMessage", {
        groupId: selectedChat._id,
        message: { type: "text", content: message },
        senderId: user._id,
      });
      setMessage(""); // Clear input
    }

    if (message.trim() && selectedChat.type === "broadcast") {
      const res = await apiClient.post("/message/broadcast", {
        groupId: selectedChat._id,
        message: { type: "text", content: message },
      });

      dispatch(addMessage(res.data));
      setMessage(""); // Clear input

      console.log("new broadcast message:", res.data);
    }
  };

  const sendFileMessage = async () => {
    if (socket && file) {
      try {
        // Create form data for the file
        const formData = new FormData();
        formData.append("groupId", selectedChat._id);
        formData.append("senderId", user._id);
        formData.append("file", file);

        // Emit file message to the server
        socket.emit("sendFile", {
          groupId: selectedChat._id,
          senderId: user._id,
          fileName: file.name,
          fileData: file,
        });

        // Optionally handle server acknowledgment if needed
        console.log("File sent successfully!");

        // Reset the file input only after confirmation
        setFile(null);
      } catch (error) {
        console.error("Error sending file:", error);
        alert("Failed to send the file. Please try again.");
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile);

      setFile(selectedFile);
    } else {
      alert("No file selected or invalid file.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">
          Messages -{" "}
          {selectedChat.type === "group"
            ? selectedChat.groupName
            : selectedChat.type === "broadcast"
            ? selectedChat.broadCastName
            : "Chat"}
        </h2>
        <ul className="space-y-4">
          {messages.map((message) => {
            // Find users who read the message
            const usersWhoRead = selectedChat.participants.filter((user) =>
              message.readBy.includes(user._id)
            );

            console.log("usersWhoRead", usersWhoRead);

            return (
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
                        {" "}
                        {message.sender === user._id
                          ? "You"
                          : selectedChat.participants.filter(
                              (p) => p._id === message.sender
                            )[0]?.username}{" "}
                        "unknown"
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === user._id
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    <div className="flex justify-center">
                      <p className="font-medium">
                        {message.sender === user._id
                          ? "You"
                          : selectedChat.participants.filter(
                              (p) => p._id === message.sender
                            )[0]?.username}
                      </p>
                      {/* TODO: group message read */}
                      {message.sender === user._id && selectedChat.type === "group" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56">
                            <div className="space-y-1">
                              <p>Read by:</p>
                              {usersWhoRead.map(({ username, _id }) => {
                                return (
                                  <div
                                    key={_id}
                                    className="px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                                  >
                                    {username}
                                  </div>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                    <p>
                      {message.message.type === "text" &&
                        message.message.content}
                    </p>
                    <img
                      src={
                        message.message.type === "file" &&
                        message.message.content
                      }
                      alt=""
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {/* TODO: only show status to the sender */}
                      {selectedChat.type === "one-to-one" &&
                        message.sender === user._id &&
                        message?.status}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4 border-t">
        <form className="flex space-x-2" onSubmit={sendTextMessage}>
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label className="flex items-center space-x-2 cursor-pointer">
            <ImageIcon className="h-5 w-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        {/* {file && ( */}
        <div className="mt-2 flex items-center space-x-2">
          <p className="text-sm text-gray-500">Selected file: {file?.name}</p>
          <Button onClick={sendFileMessage}>Send File</Button>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
