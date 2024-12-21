// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { Chat } from 'src/schemas/chat.schema';
// import { User } from 'src/schemas/user.schema';

// @Injectable()
// export class ChatService {
//   constructor(
//     @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
//     @InjectModel(User.name) private readonly userModel: Model<User>,
//   ) {}
//   async createChat({
//     groupName,
//     participants,
//     type,
//   }: {
//     groupName?: string;
//     participants: string[];
//     type: 'one-to-one' | 'group';
//   }) {
//     try {
//       let chat = new this.chatModel({ groupName, participants, type });
//       await chat.save();

//       const participantsDetails = await this.userModel
//         .find({ _id: { $in: chat.participants } })
//         .select('_id username');

//       const data = {
//         _id: chat._id,
//         groupName: chat.groupName,
//         participants: participantsDetails,
//       };

//       chat = { participants: [...participantsDetails], ...chat };

//       return data;
//     } catch (error) {}
//   }

//   async allChats(userId: string) {
//     try {
//       const chats = await this.chatModel
//         .find({ participants: userId }) // Match userId in participants array
//         .select('_id groupName'); // Select only necessary fields (_id and groupName)

//       return chats;
//     } catch (error) {}
//   }
// }

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Creates a new chat (group or one-to-one).
   * @param groupName Name of the group (optional, for group chats only).
   * @param participants Array of participant user IDs.
   * @param type Type of chat ('one-to-one' or 'group').
   * @returns Created chat details.
   */
  async createChat({
    groupName,
    participants,
    type,
  }: {
    groupName?: string;
    participants: [];
    type: 'one-to-one' | 'group';
  }) {
    try {
      // Check for valid participants
      if (!participants || participants.length < 1) {
        throw new BadRequestException('Participants array must not be empty');
      }

      // For one-to-one chats, ensure groupName is not included
      const chatData: Partial<Chat> = {
        participants,
        type,
      };

      if (type === 'group') {
        if (!groupName) {
          throw new BadRequestException(
            'Group name is required for group chats',
          );
        }
        chatData.groupName = groupName;
      }

      // Create and save the chat
      const chat = await this.chatModel.create(chatData);

      // Fetch participant details
      const participantsDetails = await this.userModel
        .find({ _id: { $in: participants } })
        .select('_id username');

      return {
        _id: chat._id,
        ...(chat.type === 'group' && { groupName: chat.groupName }), // Add groupName only if it's a group chat
        participants: participantsDetails,
        type: chat.type,
      };
    } catch (error) {
      console.error('Error creating chat:', error.message);
      throw new BadRequestException('Failed to create chat');
    }
  }

  /**
   * Retrieves all chats for a given user.
   * @param userId The ID of the user.
   * @returns Array of chats where the user is a participant.
   */
  async allChats(userId: string) {
    try {
      // const test = await this.chatModel.aggregate([
      //   {
      //     $match: {
      //       participants: userId, // Find chats where participants include the userId
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: 'users', // The collection name for users
      //       localField: 'participants',
      //       foreignField: '_id',
      //       as: 'participantDetails', // Populated participant details
      //     },
      //   },
      //   {
      //     $project: {
      //       _id: 1,
      //       groupName: 1,
      //       type: 1,
      //       participants: {
      //         $map: {
      //           input: '$participantDetails',
      //           as: 'participant',
      //           in: {
      //             _id: '$$participant._id',
      //             username: '$$participant.username',
      //           },
      //         },
      //       },
      //     },
      //   },
      // ]);

      // console.log("test",test[0])

      // Fetch all chats where the user is a participant
      const chats = await this.chatModel
        .find({ participants: userId })
        .select('_id groupName type participants');

      const test = await Promise.all(
        chats.map(async (chat) => {
          const participantDetails = await this.userModel
            .find({
              _id: { $in: chat.participants.map((p: any) => p._id || p) },
            }) // Handle both cases where participants may already contain _id
            .select('_id username');

          const flattenedParticipants = participantDetails.flatMap(
            (participant) => participant,
          );
          console.log('flattered', flattenedParticipants);

          // console.log('part', ...participantDetails);

          return {
            _id: chat._id,
            ...(chat.type === 'group' && { groupName: chat.groupName }), // Add groupName only if it's a group chat
            type: chat.type,
            participants: flattenedParticipants,
          };
        }),
      );

      console.log('test', test[0]);

      // Optional: Populate participant details if needed
      // const populatedChats = await Promise.all(
      //   chats.map(async (chat) => {
      //     const participantsDetails = await this.userModel
      //       .find({ _id: { $in: chat.participants } })
      //       .select('_id username');
      //     return {
      //       _id: chat._id,
      //       ...(chat.type === 'group' && { groupName: chat.groupName }), // Add groupName only if it's a group chat
      //       participants: [...participantsDetails],
      //       type: chat.type,
      //     };
      //   }),
      // );

      // console.log('po', populatedChats);

      // return populatedChats;
      return test;
    } catch (error) {
      console.error('Error fetching chats:', error.message);
      throw new BadRequestException('Failed to fetch chats');
    }
  }
}
