import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  groupName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: 'send' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'GroupChat', required: true })
  groupId: Types.ObjectId;

  // Add reference to the User model
}

export const MessageSchema = SchemaFactory.createForClass(Message);
