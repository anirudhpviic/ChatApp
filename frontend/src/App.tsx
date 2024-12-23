import SignUpPage from "./pages/Signup";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useGetAllChats } from "./hooks/chats/useGetAllChats";
import useGetRealTimeChat from "./hooks/chats/useGetRealTimeChat";
import useGetRealTimeMessages from "./hooks/messages/useGetRealTimeMessages";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { clearUser, updateUserTokens } from "./redux/userSlice";
import { clearChats } from "./redux/chatSlice";
import { clearMessages } from "./redux/messageSlice";
import { clearSelectedChat } from "./redux/selectedChat";
import AdminPage from "./pages/AdminPage";

// Utility to decode token and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return Date.now() >= exp * 1000; // Compare expiration with current time
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Treat invalid token as expired
  }
};

function App() {
  useGetAllChats();
  useGetRealTimeChat();
  useGetRealTimeMessages();

  const { accessToken, refreshToken, role } = useAppSelector(
    (state) => state.user
  );

  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    dispatch(clearUser());
    dispatch(clearChats());
    dispatch(clearMessages());
    dispatch(clearSelectedChat());
    window.location.href = "/login"; // Full page reload
  }, [dispatch]);

  useEffect(() => {
    const checkToken = async () => {
      console.log("check token");

      if (accessToken && isTokenExpired(accessToken)) {
        try {
          const response = await axios.post(
            "http://localhost:3000/auth/refresh-token",
            {
              refreshToken, // Assume you store the refresh token in the user state
            }
          );

          // TODO: check later
          console.log("Refresh token response:", response.data);

          // Update access token in the Redux store
          dispatch(
            updateUserTokens({
              accessToken: response.data.accessToken,
              refreshToken: response.data.newRefreshToken,
            })
          );
        } catch (error) {
          console.error("Failed to refresh token:", error);
          handleLogout();
        }
      }
    };

    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 20000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, dispatch, handleLogout]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage role="user" />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/signup" element={<SignUpPage role="admin" />} />
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
