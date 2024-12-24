import { AdminChatItem } from "./AdminChatItem";

export function AdminChatList({ details }) {
  return (
    <div>
      <div className="grid gap-4">
        {details.map((d) => (
          <AdminChatItem key={d.id} chat={d} />
        ))}
      </div>
    </div>
  );
}
