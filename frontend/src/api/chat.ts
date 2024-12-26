import { apiClient } from "./config";

const createChat = async (data) => {
  return await apiClient.post("/chat/create", data);
};

const createBroadCast = async (data) => {
  console.log("broadcasst", data);
  
  const res= await apiClient.post("/chat/create/broadcast", data);
  console.log("broad res: ", res.data);
  return res
};

export { createChat,createBroadCast };
