// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useSocketContext } from "@/context/SocketContext";
// import useGetAllMessages from "@/hooks/messages/useGetAllMessages";
// import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
// import { addMessage, updateMessage } from "@/redux/messageSlice";
// import { Send } from "lucide-react";
// import { useEffect, useState, useCallback } from "react";

// export default function MessageList() {
//   const { socket } = useSocketContext();
//   const [message, setMessage] = useState("");

//   const { loading, error } = useGetAllMessages();

//   const selectedChat = useAppSelector((state) => state.selectedChat);
//   const messages = useAppSelector((state) => state.message);
//   const user = useAppSelector((state) => state.user);

//   // const dispatch = useAppDispatch();

//   // Optimize socket listeners using useCallback
//   // const handleMessageReceived = useCallback(
//   //   (message) => {
//   //     console.log("Message received:", message);
//   //     dispatch(addMessage(message));

//   //     const payload = {
//   //       messageId: message._id,
//   //       groupId: selectedChat._id,
//   //     };

//   //     if (message.groupId === selectedChat._id) {
//   //       const event = selectedChat.type === "one-to-one" ? "messageSeen" : "messageDelivered";
//   //       socket.emit(event, payload);
//   //     }
//   //   },
//   //   [dispatch, selectedChat._id, selectedChat.type, socket]
//   // );

//   // const handleMessageStatusUpdate = useCallback(
//   //   (updatedMessage) => {
//   //     if (selectedChat._id === updatedMessage.groupId && selectedChat.type === "one-to-one") {
//   //       dispatch(updateMessage(updatedMessage));
//   //     }
//   //   },
//   //   [dispatch, selectedChat._id, selectedChat.type]
//   // );

//   // useEffect(() => {
//   //   if (!socket) return;

//   //   socket.on("receiveMessage", handleMessageReceived);
//   //   socket.on("messageSeenByUser", handleMessageStatusUpdate);
//   //   socket.on("messageDeliveredByUser", handleMessageStatusUpdate);

//   //   return () => {
//   //     socket.off("receiveMessage", handleMessageReceived);
//   //     socket.off("messageSeenByUser", handleMessageStatusUpdate);
//   //     socket.off("messageDeliveredByUser", handleMessageStatusUpdate);
//   //   };
//   // }, [socket, handleMessageReceived, handleMessageStatusUpdate]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (socket && message.trim()) {
//       socket.emit("sendMessage", {
//         groupId: selectedChat._id,
//         message,
//         senderId: user._id,
//       });
//       setMessage(""); // Clear input
//     }
//   };

//   const getUsername = (senderId) => {
//     const oppositeUser = selectedChat.participants.find((p) => p._id === senderId);
//     return oppositeUser?.username || "Unknown User";
//   };

//   const getOppositeUserOne = () => {
//     const oppositeUser = selectedChat.participants.find((p) => p._id !== user._id);
//     return oppositeUser?.username || "Unknown User";
//   };

//   if (loading) return <div>Loading messages...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4">
//         <h2 className="text-xl font-bold mb-4">
//           Messages -{" "}
//           {selectedChat.type === "group" ? selectedChat.groupName : getOppositeUserOne()}
//         </h2>
//         <ul className="space-y-4">
//           {messages.map((message) => (
//             <li
//               key={message._id}
//               className={`flex ${
//                 message.sender === user._id ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`flex items-start space-x-2 max-w-[70%] ${
//                   message.sender === user._id ? "flex-row-reverse space-x-reverse" : ""
//                 }`}
//               >
//                 {message.sender !== user._id && (
//                   <Avatar>
//                     <AvatarImage
//                       src="/placeholder.svg?height=32&width=32"
//                       alt={message.sender}
//                     />
//                     <AvatarFallback>{getUsername(message.sender)}</AvatarFallback>
//                   </Avatar>
//                 )}
//                 <div
//                   className={`p-3 rounded-lg ${message.sender === user._id ? "bg-blue-500 text-white" : ""}`}
//                 >
//                   <p className="font-medium">
//                     {message.sender === user._id ? "You" : getUsername(message.sender)}
//                   </p>
//                   <p>{message.message}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {selectedChat.type !== "group" && message.status}
//                   </p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="p-4 border-t">
//         <form className="flex space-x-2" onSubmit={sendMessage}>
//           <Input
//             type="text"
//             placeholder="Type your message..."
//             className="flex-1"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <Button type="submit">
//             <Send className="h-4 w-4" />
//             <span className="sr-only">Send</span>
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useSocketContext } from "@/context/SocketContext";
// import useGetAllMessages from "@/hooks/messages/useGetAllMessages";
// import { useAppSelector } from "@/hooks/useRedux";
// import { Send, Image as ImageIcon } from "lucide-react";
// import { useState } from "react";

// export default function MessageList() {
//   const { socket } = useSocketContext();
//   const [message, setMessage] = useState("");
//   const [file, setFile] = useState(null);

//   const { loading, error } = useGetAllMessages();

//   const selectedChat = useAppSelector((state) => state.selectedChat);
//   const messages = useAppSelector((state) => state.message);
//   const user = useAppSelector((state) => state.user);

//   // Handle text message sending
//   const sendTextMessage = (e) => {
//     e.preventDefault();
//     if (socket && message.trim()) {
//       socket.emit("sendMessage", {
//         groupId: selectedChat._id,
//         message,
//         senderId: user._id,
//       });
//       setMessage(""); // Clear input
//     }
//   };

//   // Handle file sending
//   const sendFileMessage = async () => {
//     if (socket && file) {
//       const formData = new FormData();
//       formData.append("groupId", selectedChat._id);
//       formData.append("senderId", user._id);
//       formData.append("file", file);

//       console.log("Sending file:", formData)

//       // Emit FormData to the server
//       socket.emit("sendFile", formData);

//       setFile(null); // Clear the selected file
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type.startsWith("image/")) {
//       setFile(selectedFile);
//     } else {
//       alert("Please select a valid image file.");
//     }
//   };

//   if (loading) return <div>Loading messages...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4">
//         <h2 className="text-xl font-bold mb-4">
//           Messages -{" "}
//           {selectedChat.type === "group" ? selectedChat.groupName : "Chat"}
//         </h2>
//         <ul className="space-y-4">
//           {messages.map((message) => (
//             <li
//               key={message._id}
//               className={`flex ${
//                 message.sender === user._id ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`flex items-start space-x-2 max-w-[70%] ${
//                   message.sender === user._id ? "flex-row-reverse space-x-reverse" : ""
//                 }`}
//               >
//                 {message.sender !== user._id && (
//                   <Avatar>
//                     <AvatarImage
//                       src="/placeholder.svg?height=32&width=32"
//                       alt={message.sender}
//                     />
//                     <AvatarFallback>{message.sender}</AvatarFallback>
//                   </Avatar>
//                 )}
//                 <div
//                   className={`p-3 rounded-lg ${
//                     message.sender === user._id ? "bg-blue-500 text-white" : ""
//                   }`}
//                 >
//                   <p className="font-medium">
//                     {message.sender === user._id ? "You" : message.sender}
//                   </p>
//                   <p>{message.message}</p>
//                   <p className="text-xs text-gray-500 mt-1">{message.status}</p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="p-4 border-t">
//         <form className="flex space-x-2" onSubmit={sendTextMessage}>
//           <Input
//             type="text"
//             placeholder="Type your message..."
//             className="flex-1"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <label className="flex items-center space-x-2 cursor-pointer">
//             <ImageIcon className="h-5 w-5" />
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleFileChange}
//             />
//           </label>
//           <Button type="submit">
//             <Send className="h-4 w-4" />
//             <span className="sr-only">Send</span>
//           </Button>
//         </form>
//         {file && (
//           <div className="mt-2 flex items-center space-x-2">
//             <p className="text-sm text-gray-500">Selected file: {file.name}</p>
//             <Button onClick={sendFileMessage}>Send File</Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocketContext } from "@/context/SocketContext";
import useGetAllMessages from "@/hooks/messages/useGetAllMessages";
import { useAppSelector } from "@/hooks/useRedux";
import { Send, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function MessageList() {
  const { socket } = useSocketContext();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const { loading, error } = useGetAllMessages();

  const selectedChat = useAppSelector((state) => state.selectedChat);
  const messages = useAppSelector((state) => state.message);
  const user = useAppSelector((state) => state.user);

  // Handle text message sending
  const sendTextMessage = (e) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit("sendMessage", {
        groupId: selectedChat._id,
        message: { type: "text", content: message },
        senderId: user._id,
      });
      setMessage(""); // Clear input
    }
  };

  // Handle file sending
  // const sendFileMessage = () => {
  //   console.log("file", file);

  //   if (socket && file) {
  //     const formData = new FormData();
  //     formData.append("groupId", selectedChat._id);
  //     formData.append("senderId", user._id);
  //     formData.append("file", file);

  //     // Emit the file event
  //     socket.emit("sendFile", {
  //       groupId: selectedChat._id,
  //       senderId: user._id,
  //       fileName: file.name,
  //       fileData: file,
  //     });

  //     setFile(null); // Clear the selected file
  //   }
  // };

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

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">
          Messages -{" "}
          {selectedChat.type === "group" ? selectedChat.groupName : "Chat"}
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
                    <AvatarFallback>{message.sender}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === user._id ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  <p className="font-medium">
                    {message.sender === user._id ? "You" : message.sender}
                  </p>
                  <p>
                    {message.message.type === "text" && message.message.content}
                  </p>
                  <img
                    src={
                      message.message.type === "file" && message.message.content
                    }
                    alt=""
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedChat.type !== "group" && message?.status}
                  </p>
                </div>
              </div>
            </li>
          ))}
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
