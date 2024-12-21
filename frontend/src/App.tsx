import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import SignUpPage from "./pages/Signup";
import { refreshToken } from "./api/auth";
import { updateUserTokens } from "./redux/userSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import useSocket from "./hooks/useSocket";

function App() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // TODO: calling socket
  // useSocket();

  // const checkTokenExpiration = async () => {
  //   if (user.accessToken) {
  //     const token = user.accessToken.split(" ")[1];
  //     if (token) {
  //       const decodedToken = JSON.parse(atob(token.split(".")[1]));
  //       const expirationTime = decodedToken.exp;
  //       const currentTime = Math.floor(Date.now() / 1000);
  //       if (expirationTime < currentTime) {
  //         // TODO: tokoen expired logic
  //         // setIsAuthenticated(false);

  //         try {
  //           const res = await refreshToken(user.refreshToken);
  //           dispatch(
  //             updateUserTokens({
  //               accessToken: res.data.accessToken,
  //               refreshToken: res.data.refreshToken,
  //             })
  //           );
  //           return true;
  //         } catch (error) {
  //           console.error(error);
  //           // TODO: navigate to login
  //           throw error;
  //         }
  //       }

  //       return true;
  //     }
  //   }

  //   throw new Error("Token not found");
  // };

  // useEffect(() => {
  //   const intervalId = setInterval(checkTokenExpiration, 20000);

  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Route: Home */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
