import axios from "axios";

const signup = async ({
  username,
  password,
  role,
}: {
  username: string;
  password: string;
  role: string;
}) => {
  return await axios.post(
    "http://localhost:3000/auth/signup",
    { username, password ,role},
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
    "http://localhost:3000/auth/login",
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
    "http://localhost:3000/auth/refresh-token",
    { refreshToken },
    {
      withCredentials: true,
    }
  );
};

export { signup, login, logout, refreshToken };
