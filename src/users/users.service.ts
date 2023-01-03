import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) { }
    async createUser(username: string, password: string): Promise<User> {
    // check a user with that username
    const user = await this.userModel.findOne({ username })
    // Check if user already exists
    if(user) {
        // User already exists
        throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST);
    }
        return this.userModel.create({
            username,
            password,
        });
    }
    async getUser(query: object ): Promise<User> {
        return this.userModel.findOne(query);
    }

    async findOne(body){
        return this.userModel.findOne({
            where:{email: body.email, id: body.id},
        });
    }
}   