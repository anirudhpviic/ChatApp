import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/services/message.service';
import { SocketService } from 'src/services/socket.service';

@WebSocketGateway({
  cors: { origin: '*' }, // Allow all origins for simplicity
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer() server: Server;

  // async handleConnection(socket: Socket) {
  //   console.log(`Client connected: ${socket.id}`);

  //   // Simulate fetching user groups from a database
  //   const userId = socket.handshake.query.userId as string; // Get userId from query params
  //   const userGroups = await this.socketService.getUserGroups(userId); // Replace with DB call

  //   console.log('userGroups', userGroups);

  //   // // Join rooms for each group
  //   userGroups.forEach(({ _id: groupId }) => {
  //     socket.join(groupId as string);
  //     console.log(`Socket ${socket.id} joined room ${groupId}`);
  //   });
  // }

  async handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);

    const userId = socket.handshake.query.userId as string;

    // Fetch groups for the user (mocked or from DB)
    const userGroups = await this.socketService.getUserGroups(userId);
    console.log('User groups:', userGroups);

    // Ensure user joins each room
    userGroups.forEach(({ _id: groupId }) => {
      socket.join(groupId.toString());
      console.log(`Socket ${socket.id} joined room ${groupId}`);
    });
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  // @SubscribeMessage('sendMessage')
  // handleMessage(
  //   @MessageBody() data: { groupId: string; message: string },
  //   @ConnectedSocket() socket: Socket,
  // ) {
  //   console.log('data', data);
  //   // Broadcast message to the group room
  //   this.server.to(data.groupId).emit('receiveMessage', {
  //     sender: socket.id,
  //     message: data.message,
  //   });
  // }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { groupId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('Received message:', data);

    // Save the message to the database
    const savedMessage = await this.messageService.createMessage({
      groupName: data.groupId,
      sender: socket.id,
      content: data.message,
      groupId: data.groupId,
    });

    // Broadcast to the specific group room
    this.server.to(data.groupId).emit('receiveMessage', savedMessage);
  }

  // Mock function to get user groups
  //   async getUserGroups(userId: string): Promise<string[]> {
  //     // Replace with actual DB logic
  //     return ['group1', 'group2']; // Example group IDs
  //   }
}
