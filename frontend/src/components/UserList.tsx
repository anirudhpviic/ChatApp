import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setSelectedChat } from "@/redux/selectedChat";

export default function UserList() {
  const chats = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const { _id: userId, username } = useAppSelector((state) => state.user);

  // Helper to get username or group initials
  const getAvatarInitial = (chat) => {
    if (chat.type === "group") {
      // Return the first letter(s) of the group name
      return chat.groupName
        ?.split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase();
    }

    // Get the opposite user
    const oppositeUser = chat.participants.find((p) => p._id !== userId);
    const fallbackUsername = oppositeUser?.username;

    // Return the first letter of the username
    return fallbackUsername[0]?.toUpperCase() || "?";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <p>{username}</p>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li
            key={chat._id}
            onClick={() => dispatch(setSelectedChat(chat))}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <Avatar>
              <AvatarFallback>{getAvatarInitial(chat)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {chat.type === "group"
                  ? chat.groupName
                  : chat.participants.find((p) => p._id !== userId)?.username ||
                    "?"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
