import { useSocketContext } from "@/context/SocketContext";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../useRedux";
import { addChat } from "@/redux/chatSlice";

const useGetRealTimeChat = () => {
  const { socket } = useSocketContext();
  const { _id: userId } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleNewChat = (groupId) => {
      socket?.emit("newRoomJoin", { groupId, userId });
    };

    socket?.on("joinChatRoom", handleNewChat);

    return () => {
      socket?.off("joinChatRoom", handleNewChat);
    };
  }, [socket, userId]);

  useEffect(() => {
    const handleNewRoomJoined = (data) => {
      dispatch(addChat(data));
    };

    socket?.on("newRoomJoined", handleNewRoomJoined);

    return () => {
      socket?.off("newRoomJoined", handleNewRoomJoined);
    };
  }, [dispatch, socket]);
};

export default useGetRealTimeChat;
