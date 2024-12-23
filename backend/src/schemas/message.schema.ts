import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop()
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  groupId: Types.ObjectId;

  // Add reference to the User model
}

export const MessageSchema = SchemaFactory.createForClass(Message);
