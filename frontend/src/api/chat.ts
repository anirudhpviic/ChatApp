import { apiClient } from "./config";

const createChat = async (data) => {
  return await apiClient.post("/chat/create", data);
};

const createBroadCast = async (data) => {
  return await apiClient.post("/chat/create/broadcast", data);
};

export { createChat, createBroadCast };
