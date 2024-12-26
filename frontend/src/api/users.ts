import { apiClient } from "./config";

const getAllUsers = async () => {
  return await apiClient.get("/user");
};

const getAllConnectedUsers = async () => {
  return await apiClient.get("/user/connected");
};
export { getAllUsers, getAllConnectedUsers };
