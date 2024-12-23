import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId; // Reference to the User model

  @Prop({
    type: Object,
    required: true,
  })
  message: {
    type: string; // Type of the message (e.g., "text", "image", etc.)
    content: string; // The actual content (text or file URL)
    format?: string; // Optional format for files (e.g., "jpg", "pdf")
  };

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Automatically sets the creation date

  @Prop({ type: String })
  status: string; // Message status

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  groupId: Types.ObjectId; // Reference to the Chat model
}

export const MessageSchema = SchemaFactory.createForClass(Message);
