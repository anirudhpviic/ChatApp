import { useState } from "react";
import { AdminChatItem } from "./AdminChatItem";
import { Input } from "@/components/ui/input";

// Mock data for chats
const initialChats = [
  { id: 1, name: "General Chat", participants: 150 },
  { id: 2, name: "Tech Support", participants: 75 },
  { id: 3, name: "Random Discussions", participants: 200 },
  { id: 4, name: "Announcements", participants: 500 },
  { id: 5, name: "New Users", participants: 50 },
];

export function AdminChatList({details}) {
  // const [chats, setChats] = useState(initialChats);
  // const [searchTerm, setSearchTerm] = useState("");

  // const filteredChats = chats.filter((chat) =>
  //   chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div>
      {/* <Input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      /> */}
      <div className="grid gap-4">
        {details.map((d) => (
          <AdminChatItem key={d.id} chat={d} />
        ))}
      </div>
    </div>
  );
}
