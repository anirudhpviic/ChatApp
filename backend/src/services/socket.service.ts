import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class SocketService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
  ) {}

  private server: Server;
  private socket: Socket;

  async getUserGroups(userId: string) {
    // const user = await this.userModel.findById(userId);
    return await this.chatModel
      .find({ participants: userId }) // Match userId in participants array
      .select('_id'); // Select only necessary fields (_id and groupName)
  }

  // Set the WebSocket server instance
  setServer(server: Server) {
    this.server = server;
  }

  // Get the WebSocket server instance
  getServer(): Server {
    return this.server;
  }

  setSocket(socket: Socket) {
    this.socket = socket;
  }

  getSocket(): Socket {
    return this.socket;
  }
}
