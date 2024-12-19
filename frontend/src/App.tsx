// import React from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import Signup from "./pages/signupPage";
// import Login from "./pages/loginPage";
// import Home from "./pages/homePage";
// import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import SignUpPage from "./pages/Signup";
import { refreshToken } from "./api/auth";
import { updateUserTokens } from "./redux/userSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkTokenExpiration = async () => {
    if (user.accessToken) {
      const token = user.accessToken.split(" ")[1];
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        if (expirationTime < currentTime) {
          // TODO: tokoen expired logic
          // setIsAuthenticated(false);

          try {
            const res = await refreshToken(user.refreshToken);
            dispatch(
              updateUserTokens({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
              })
            );
            // setIsAuthenticated(true);
            return true;
          } catch (error) {
            // TODO: navigate to login
          }
        }

        // setIsAuthenticated(true);

        return true;
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkTokenExpiration, 50000);

    return () => clearInterval(intervalId);
  }, []);

  // return <SignUpPage />;

  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route
          path="/login"
          // element={
          //   !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
          // }
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          // element={
          //   !isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />
          // }
          element={<SignUpPage />}
        />

        {/* Protected Route: Home */}
        <Route
          path="/"
          // element={
          //   isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
          // }
          element={<HomePage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
