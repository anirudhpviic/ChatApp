import axios from "axios";

const getAllUsers = async () => {
  return await axios.get(
    "http://localhost:3000/users",

    { withCredentials: true }
  );
};

export { getAllUsers };
