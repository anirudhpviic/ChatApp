import { apiClient } from "./config";

const createChat = async (data) => {
  return await apiClient.post("/chat/create", { data });
};

export { createChat };
