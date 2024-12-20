import axios from "axios";

const createGroupChat = async (data) => {
  return await axios.post(
    "http://localhost:3000/chat/create-group",
    {data},
    { withCredentials: true }
  );
};

export { createGroupChat };
