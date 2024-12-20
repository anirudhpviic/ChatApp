import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector } from "@/hooks/useRedux";

// const chats = [
//   { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg?height=32&width=32', status: 'online' },
//   { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg?height=32&width=32', status: 'offline' },
//   { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg?height=32&width=32', status: 'online' },
//   { id: 4, name: 'Diana Prince', avatar: '/placeholder.svg?height=32&width=32', status: 'away' },
// ]

export default function UserList() {
    const chats = useAppSelector((state) => state.chat);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">chats</h2>
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li key={chat._id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Avatar>
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              <AvatarFallback>{chat.groupName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{chat.groupName}</p>
              {/* <p className="text-sm text-gray-500">{user.status}</p> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

