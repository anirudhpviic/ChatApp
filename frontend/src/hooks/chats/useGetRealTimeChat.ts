import { useSocketContext } from "@/context/SocketContext";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../useRedux";
import { addChat } from "@/redux/chatSlice";

const useGetRealTimeChat = () => {
  const { socket } = useSocketContext();
  const chats = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   const handleNewChat = (newChat) => {
  //     console.log("newChat:", newChat);
  //   };

  //   socket?.on("newChat", handleNewChat);

  //   return () => {
  //     socket?.off("newChat", handleNewChat);
  //   };
  // }, [dispatch, socket]);

  useEffect(() => {
    const handleNewChat = (newChat) => {
      console.log("newChat:", newChat);
      // if (chats.some((chat) => chat.F_id === newChat._id)) return;
      // dispatch(addChat(newChat));
    };

    socket?.on("newChat", handleNewChat);

    return () => {
      socket?.off("newChat", handleNewChat);
    };
  }, [ dispatch, socket]);
};

export default useGetRealTimeChat;
