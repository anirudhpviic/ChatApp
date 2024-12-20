import axios from "axios";

const signup = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return await axios.post(
    "http://localhost:3000/users/signup",
    { username, password },
    { withCredentials: true }
  );
};

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return await axios.post(
    "http://localhost:3000/users/login",
    {
      username,
      password,
    },
    { withCredentials: true }
  );
};

const logout = async () => {
  return await axios.get("http://localhost:3000/users/logout", {
    withCredentials: true,
  });
};

const refreshToken = async (refreshToken: string) => {
  return await axios.post(
    "http://localhost:3000/users/refresh-token",
    {refreshToken},
    {
      withCredentials: true,
    }
  );
};

export { signup, login, logout, refreshToken };
