import { apiClient } from "./config";

const getAllUsers = async () => {
  return await apiClient.get("/user");
};

export { getAllUsers };
