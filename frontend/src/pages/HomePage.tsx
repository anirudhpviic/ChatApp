import CreateBroadCast from "@/components/CreateBroadCast";
import CreateChat from "@/components/CreateChat";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import UserList from "@/components/UserList";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { clearChats } from "@/redux/chatSlice";
import { clearMessages } from "@/redux/messageSlice";
import { clearSelectedChat } from "@/redux/selectedChat";
import { clearUser } from "@/redux/userSlice";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBroadCastCreate, setIsOpenBroadCastCreate] = useState(false);
  const user = useAppSelector((state) => state.user);
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

  const handleOpenCrateBroadCast = useCallback(() => {
    setIsOpenBroadCastCreate(true);
  }, []);

  const handleCloseCrateBroadCast = useCallback(() => {
    setIsOpenBroadCastCreate(false);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 space-y-4">
        <h2>{user.username}</h2>

        <Button onClick={handleOpenCreatePage} className="w-full">
          Create Chat
        </Button>
        {/* create broadcast */}
        <Button onClick={handleOpenCrateBroadCast} className="w-full">
          Create BroadCast
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
      {isOpenBroadCastCreate && (
        <CreateBroadCast
          isOpen={isOpenBroadCastCreate}
          setIsOpen={handleCloseCrateBroadCast}
        />
      )}
    </div>
  );
};

export default HomePage;
