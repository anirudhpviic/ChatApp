import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChatItemProps {
  chat: {
    _id: string;
    type: string;
    groupName?: string;
    participants: string[];
  };
}

export function AdminChatItem({ chat }: ChatItemProps) {
  return (
    <Card key={chat._id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {chat.type === "group" ? chat.groupName : "One-to-one"}
        </CardTitle>
        <Badge variant="secondary">{chat.participants.length} participants</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">Chat ID: {chat._id}</div>
      </CardContent>
    </Card>
  );
}
