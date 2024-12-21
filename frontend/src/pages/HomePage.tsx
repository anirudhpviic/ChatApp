import CreateGroup from "@/components/CreateGroup";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import UserList from "@/components/UserList";
import { useAppDispatch } from "@/hooks/useRedux";
import { clearChats } from "@/redux/chatSlice";
import { clearMessages } from "@/redux/messageSlice";
import { clearSelectedChat } from "@/redux/selectedChat";
import { clearUser } from "@/redux/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here
    dispatch(clearUser());
    dispatch(clearChats());
    dispatch(clearMessages());
    dispatch(clearSelectedChat());

    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <Button onClick={() => setIsOpen(true)}>Create Group</Button>
        <Button onClick={handleLogout}>Logout</Button>

        <UserList />
      </div>
      <div className="flex-1">
        <MessageList />
      </div>
      {isOpen && <CreateGroup isOpen={isOpen} setIsOpen={setIsOpen} />}{" "}
    </div>
  );
};

export default HomePage;
