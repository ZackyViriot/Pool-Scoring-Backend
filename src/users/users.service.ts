import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<UserDocument> {
    // Ensure email is stored in lowercase for consistency
    if (createUserDto.email) {
      createUserDto.email = createUserDto.email.toLowerCase();
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    // Use case-insensitive search by converting email to lowercase
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Method to normalize existing user emails to lowercase
  async normalizeEmails(): Promise<void> {
    const users = await this.userModel.find({}).exec();
    for (const user of users) {
      if (user.email !== user.email.toLowerCase()) {
        user.email = user.email.toLowerCase();
        await user.save();
      }
    }
  }
} 