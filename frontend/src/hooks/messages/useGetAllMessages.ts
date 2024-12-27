import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"; // assuming your useRedux hook is set up
import { apiClient } from "@/api/config";
import { setMessages } from "@/redux/messageSlice";

const useGetAllMessages = () => {
  // Get selected chat (group) from Redux store
  const selectedChat = useAppSelector((state) => state.selectedChat);

  // States for loading, error, and messages
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only fetch messages if a selected chat exists
    if (!selectedChat?._id) return;

    const getMessages = async () => {
      setLoading(true);
      setError(null); // Reset previous error if any

      try {
        const response = await apiClient.get("/message", {
          params: { groupId: selectedChat._id },
        });
        dispatch(setMessages(response.data));
      } catch (err: any) {
        setError("Failed to load messages");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedChat?._id,dispatch]); // Re-run when selectedChat changes

  return { loading, error };
};

export default useGetAllMessages;
