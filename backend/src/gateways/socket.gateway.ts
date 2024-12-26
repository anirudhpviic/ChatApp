import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/services/message.service';
import { SocketService } from 'src/services/socket.service';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { Chat } from 'src/schemas/chat.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';

@WebSocketGateway({
  cors: { origin: '*' }, // Allow all origins for simplicity
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly messageService: MessageService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private socket;
  async handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
    const userId = socket.handshake.query.userId as string;

    try {
      // Associate the socket with the user in the service
      this.socketService.setServer(this.server);

      socket.join(userId);

      // Fetch and join user groups
      const userGroups = await this.socketService.getUserGroups(userId);
      userGroups.forEach(({ _id: groupId }) => {
        socket.join(groupId.toString());
        console.log(`Socket ${socket.id} joined room ${groupId}`);
      });

      this.socket = socket;
    } catch (error) {
      console.error('Error handling connection:', error.message);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('newRoomJoin')
  async handleJoinNewChat(
    @MessageBody() data: { groupId: string; userId: string },
  ) {
    const { groupId, userId } = data;

    try {
      const chat = await this.chatModel.findById(groupId);

      this.socket.join(groupId);

      // Fetch participant details
      const participantDetails = await this.userModel
        .find({ _id: { $in: chat.participants } })
        .select('_id username');

      this.server.to(userId).emit('newRoomJoined', {
        _id: chat._id,
        type: chat.type,
        ...(chat.type === 'group' && { groupName: chat.groupName }),
        participants: participantDetails,
      });
    } catch (error) {
      console.error('Error joining room:', error.message);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      groupId: string;
      message: {
        type: string;
        content: string;
        format?: string;
      };
      senderId: string;
    },
  ) {
    try {
      // Save the message and broadcast it
      const savedMessage = await this.messageService.createMessage({
        sender: data.senderId,
        message: data.message,
        groupId: data.groupId,
        status: 'send',
      });

      this.server.to(data.groupId).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error('Error handling message:', error.message);
    }
  }

  @SubscribeMessage('sendFile')
  async handleFileUpload(
    @MessageBody()
    data: {
      groupId: string;
      fileName: string;
      fileData: Buffer;
      senderId: string;
    },
  ) {
    const { fileName, fileData, groupId, senderId } = data;

    try {
      // Upload file to Cloudinary
      const { url } = await this.cloudinaryService.uploadFile(
        fileData,
        fileName,
      );

      // Save message with file data
      const savedMessage = await this.messageService.createMessage({
        sender: senderId,
        groupId,
        status: 'send',
        message: {
          type: 'file',
          content: url,
        },
      });

      // Broadcast the message to the group
      this.server.to(groupId).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error('Error handling file upload:', error.message);
    }
  }

  @SubscribeMessage('messageRead')
  async handleMessageRead(
    @MessageBody()
    data: {
      messageId: string;
      userId: string;
      senderId: string;
    },
  ) {
    await this.messageService.updateMessageReady({
      messageId: data.messageId,
      userId: data.userId,
    });

    this.server.to(data.senderId).emit('messageReadByUser', {
      messageId: data.messageId,
      readerId: data.userId,
    });
  }

  @SubscribeMessage('messageSeen')
  async handleMessageSeen(
    @MessageBody() data: { groupId: string; messageId: string },
  ) {
    try {
      const updatedMessage = await this.messageService.updateMessageStatus({
        messageId: data.messageId,
        status: 'seen',
      });

      this.server.to(data.groupId).emit('messageSeenByUser', updatedMessage);
    } catch (error) {
      console.error('Error updating message status to seen:', error.message);
    }
  }

  @SubscribeMessage('messageDelivered')
  async handleMessageDelivered(
    @MessageBody() data: { groupId: string; messageId: string },
  ) {
    try {
      const updatedMessage = await this.messageService.updateMessageStatus({
        messageId: data.messageId,
        status: 'delivered',
      });

      this.server
        .to(data.groupId)
        .emit('messageDeliveredByUser', updatedMessage);
    } catch (error) {
      console.error(
        'Error updating message status to delivered:',
        error.message,
      );
    }
  }
}
