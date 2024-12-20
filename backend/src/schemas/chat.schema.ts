import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class GroupChat extends Document {
  @Prop({ required: true })
  groupName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  participants: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);
