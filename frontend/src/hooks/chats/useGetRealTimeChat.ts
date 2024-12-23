import { useSocketContext } from "@/context/SocketContext";
import React, { useEffect } from "react";
import { useAppDispatch } from "../useRedux";

const useGetRealTimeChat = () => {
  const { socket } = useSocketContext();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleNewChat = (newChat) => {
      console.log("newChat:", newChat);
    };

    socket?.on("newChat", handleNewChat);

    return () => {
      socket?.off("newChat", handleNewChat);
    };
  }, [dispatch, socket]);
};

export default useGetRealTimeChat;
