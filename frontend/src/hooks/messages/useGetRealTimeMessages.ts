import { useSocketContext } from "@/context/SocketContext";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../useRedux";
import {
  addMessage,
  updateGroupMessageSeen,
  updateMessageSlice,
} from "@/redux/messageSlice";

const useGetRealTimeMessages = () => {
  const { socket } = useSocketContext();
  const selectedChat = useAppSelector((state) => state.selectedChat);
  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    socket?.on("receiveMessage", (message) => {
      console.log("chat.id", selectedChat._id);

      console.log("real time message", message);
      if (message.groupId === selectedChat._id) {
        dispatch(addMessage(message));

        // TODO: group mesaage read send
        if (
          message.groupId === selectedChat._id &&
          selectedChat.type === "group" &&
          message?.sender !== user?._id
        ) {
          socket.emit("messageRead", {
            messageId: message._id,
            userId: user._id,
            senderId: message.sender,
          });
        }

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

      // TODO: send message seen group opposite user
    });

    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket, dispatch, selectedChat._id]);

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

  useEffect(() => {
    const handleMessageRead = ({ messageId, readerId }) => {
      console.log("groupd message :", messageId, "reader:", readerId);
      dispatch(updateGroupMessageSeen({ messageId, readerId }));
    };
    socket?.on("messageReadByUser", handleMessageRead);

    return () => {
      socket?.off("messageReadByUser", handleMessageRead);
    };
  }, [socket]);

  useEffect(() => {
    const handleBroadcastMessage = (message) => {
      console.log("broadcast message:", message);
      const isSenderInParticipants = selectedChat.participants.some(
        (participant) => participant._id === message.sender
      );

      if (selectedChat.type === "one-to-one" && isSenderInParticipants) {
        dispatch(addMessage(message));
      }
    };

    socket?.on("broadcastMessage", handleBroadcastMessage);

    return () => {
      socket?.off("broadcastMessage", handleBroadcastMessage);
    };
  }, [socket]);
};

export default useGetRealTimeMessages;
