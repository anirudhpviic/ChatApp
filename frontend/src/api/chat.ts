import { apiClient } from "./config";

const createGroupChat = async (data) => {
  return await apiClient.post("/chat/create", { data });
};

export { createGroupChat };
