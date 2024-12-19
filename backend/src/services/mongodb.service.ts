import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

// Marks the class as a service that can be injected into other modules.
@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  // This method provides the database configuration options.
  createMongooseOptions(): MongooseModuleOptions {
    return {
      // The database connection URI, fallback to local MongoDB if no .env is provided.
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app',
      // Additional options to ensure a stable connection.
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    };
  }
}
