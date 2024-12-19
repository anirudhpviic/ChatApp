import MessageList from '@/components/MessageList'
import UserList from '@/components/UserList'

const HomePage = () => {

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <UserList />
      </div>
      <div className="flex-1">
        <MessageList />
      </div>
    </div>
  )
}

export default HomePage