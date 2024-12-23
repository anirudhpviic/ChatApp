import SignUpPage from "./pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { useGetAllChats } from "./hooks/chats/useGetAllChats";
import useGetRealTimeChat from "./hooks/chats/useGetRealTimeChat";

function App() {
  useGetAllChats();
  useGetRealTimeChat()

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
