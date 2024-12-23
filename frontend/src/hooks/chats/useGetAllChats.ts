import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { apiClient } from "@/api/config";
import { setChats } from "@/redux/chatSlice";

export const useGetAllChats = () => {
  const dispatch = useAppDispatch();
  const { _id: userId } = useAppSelector((state) => state.user);

  // Fetch all chats
  const getAllChats = async () => {
    try {
      const res = await apiClient.get("http://localhost:3000/chat", {
        params: { userId }, // Query parameters
      });
      dispatch(setChats(res.data));
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      getAllChats();
    }
  }, [userId]);

  return; // You can return loading and error states if needed
};
