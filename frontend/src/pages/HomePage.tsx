import CreateChat from "@/components/CreateChat";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import UserList from "@/components/UserList";
import { useAppDispatch } from "@/hooks/useRedux";
import { clearChats } from "@/redux/chatSlice";
import { clearMessages } from "@/redux/messageSlice";
import { clearSelectedChat } from "@/redux/selectedChat";
import { clearUser } from "@/redux/userSlice";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(clearUser());
    dispatch(clearChats());
    dispatch(clearMessages());
    dispatch(clearSelectedChat());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleOpenCreatePage = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseCreatePage = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 space-y-4">
        <Button onClick={handleOpenCreatePage} className="w-full">
          Create Group
        </Button>
        <Button onClick={handleLogout} className="w-full">
          Logout
        </Button>
        {/* User List */}
        <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1">
        <MessageList />
      </div>

      {/* Create Group Modal */}
      {isOpen && (
        <CreateChat isOpen={isOpen} setIsOpen={handleCloseCreatePage} />
      )}
    </div>
  );
};

export default HomePage;
