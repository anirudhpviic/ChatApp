import { useSocketContext } from "@/context/SocketContext";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../useRedux";
import { addMessage, updateMessageSlice } from "@/redux/messageSlice";

const useGetRealTimeMessages = () => {
  const { socket } = useSocketContext();
  const selectedChat = useAppSelector((state) => state.selectedChat);
  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      console.log(message);
      if (message.groupId === selectedChat._id) {
        dispatch(addMessage(message));

        if (
          (message?.status === "send" || message?.status === "delivered") &&
          message?.sender !== user?._id
        ) {
          socket.emit("messageSeen", {
            messageId: message._id,
            groupId: message.groupId,
          });
        }
      } else {
        if (message?.status === "send" && message?.sender !== user?._id) {
          socket.emit("messageDelivered", {
            messageId: message._id,
            groupId: message.groupId,
          });
        }
      }
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket, dispatch, selectedChat._id, user?._id]);

  useEffect(() => {
    const handleMessageDelivered = (updatedMessage) => {
      console.log("mesage delivered check 3", updatedMessage);
      dispatch(updateMessageSlice(updatedMessage));
    };

    socket?.on("messageDeliveredByUser", handleMessageDelivered);

    return () => {
      socket?.off("messageDeliveredByUser", handleMessageDelivered);
    };
  }, [socket]);

  useEffect(() => {
    const handleMessageSeen = (updatedMessage) => {
      console.log("message seen check 4", updatedMessage);
      dispatch(updateMessageSlice(updatedMessage));
    };

    socket?.on("messageSeenByUser", handleMessageSeen);

    return () => {
      socket?.off("messageSeenByUser", handleMessageSeen);
    };
  }, [dispatch, socket]);
};

export default useGetRealTimeMessages;
