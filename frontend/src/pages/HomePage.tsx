import CreateGroup from "@/components/CreateGroup";
import MessageList from "@/components/MessageList";
import { Button } from "@/components/ui/button";
import UserList from "@/components/UserList";
import { useState } from "react";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <Button onClick={() => setIsOpen(true)}>Create Group</Button>
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
