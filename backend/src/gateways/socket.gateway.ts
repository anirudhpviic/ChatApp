import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { multerConfig } from 'src/config/multer.config';
import { MessageService } from 'src/services/message.service';
import { SocketService } from 'src/services/socket.service';
import { Multer } from 'multer';
import { join } from 'path';
import { writeFile, writeFileSync } from 'fs';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from 'src/services/cloudinary.service';

@WebSocketGateway({
  cors: { origin: '*' }, // Allow all origins for simplicity
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly messageService: MessageService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);

    this.socketService.setServer(this.server);

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

  // Messages logics
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      groupId: string;
      message: {
        type: string;
        content: string; // The actual content (text or file URL)
        format?: string; // Optional format for files (e.g., "jpg", "pdf")
      };
      senderId: string;
    },
  ) {
    // Save the message to the database
    const savedMessage = await this.messageService.createMessage({
      sender: data.senderId,
      message: data.message,
      groupId: data.groupId,
      status: 'send',
    });

    console.log('send message:', savedMessage);

    // Broadcast to the specific group room
    this.server.to(data.groupId).emit('receiveMessage', savedMessage);
  }

  // Handle file upload event
  // @SubscribeMessage('sendFile')
  // async handleFileUpload(@MessageBody() data) {
  //   try {
  //     console.log(data);

  //     const { fileName, fileData } = data;

  //     const filePath = join(__dirname, '..', 'uploads', fileName); // Save to "uploads" directory
  //     // await writeFile(filePath, fileData); // Write the buffer to a file
  //     await writeFile(filePath, fileData, { encoding: 'utf8' });
  //     console.log(`File saved at: ${filePath}`);
  //   } catch (error) {
  //     console.error('File upload failed:', error);
  //     this.server.emit('fileUploaded', {
  //       success: false,
  //       error: error.message,
  //     });
  //   }
  // }

  // Handle file upload event
  @SubscribeMessage('sendFile')
  async handleFileUpload(@MessageBody() data) {
    const { fileName, fileData } = data;

    try {
      // const uploadResult: any = await this.cloudinaryService.uploadFile(
      //   fileData,
      //   fileName,
      // );
      // console.log('upload:', uploadResult.data);
      // console.log('url', uploadResult);

      const { url, type } = await this.cloudinaryService.uploadFile(
        fileData,
        fileName,
      );
      // console.log('Uploaded File URL:', uploadResult);

      // Save the message to the database
      const savedMessage = await this.messageService.createMessage({
        sender: data.senderId,
        groupId: data.groupId,
        status: 'send',
        message: {
          type: 'file',
          content: url,
          // format: type,
        },
      });

      // console.log('send message:', savedMessage);

      // Broadcast to the specific group room
      this.server.to(data.groupId).emit('receiveMessage', savedMessage);
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('messageSeen')
  async handleMessageSeen(
    @MessageBody() data: { groupId: string; messageId: string },
  ) {
    // Save the message to the database
    const updatedMessage = await this.messageService.updateMessageStatus({
      messageId: data.messageId,
      status: 'seen',
    });

    console.log('message seen:', updatedMessage);

    // Broadcast to the specific group room
    this.server.to(data.groupId).emit('messageSeenByUser', updatedMessage);
  }

  @SubscribeMessage('messageDelivered')
  async handleMessageDelivered(
    @MessageBody() data: { groupId: string; messageId: string },
  ) {
    // Save the message to the database
    const updatedMessage = await this.messageService.updateMessageStatus({
      messageId: data.messageId,
      status: 'delivered',
    });

    console.log('message delivered :', updatedMessage);

    // Broadcast to the specific group room
    this.server.to(data.groupId).emit('messageDeliveredByUser', updatedMessage);
  }
}
