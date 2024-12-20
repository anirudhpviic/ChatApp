import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { addMessage } from "@/redux/messageSlice";

const useSocket = () => {
  const { _id: userId } = useAppSelector((state) => state.user);
  const [socket, setSocket] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3000", {
      query: { userId }, // Pass userId as query param
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
    });

    newSocket.on("receiveMessage", (message) => {
      console.log("Message received:", message);
      dispatch(addMessage(message));
    });

    return () => {
      newSocket.disconnect(); // Cleanup on unmount
    };
  }, [userId]);

  return socket;
};

export default useSocket;
