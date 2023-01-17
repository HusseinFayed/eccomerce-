import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DepositDto } from '../../dtos/deposit.dto';
import { User, UserDocument } from '../../models/users.model';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../../dtos/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) { }

    async createUser(user: UserDto): Promise<User> {
        // check a user with that username
        const user_check = await this.userModel.findOne({ username: user.username })
        // Check if user already exists
        if (user_check) {
            // User already exists
            throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST);
        }

        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
        return this.userModel.create({
            username: user.username,
            password: hashedPassword,
            // deposit: user.deposit,
            role: user.role,
        });
    }
    async getUser(query: object): Promise<User> {
        return this.userModel.findOne(query);
    }

    async findOne(body) {
        return this.userModel.findOne({
            where: { email: body.email, id: body.id },
        });
    }

    async getUserById(id: string): Promise<User> {
        return await this.userModel.findOne({ where: { _id: new Types.ObjectId(id) } })
    }

    async getUserByUserName(username: string): Promise<User> {
        return await this.userModel.findOne({ username: username })
    }

    async deposit(req, userCheck, deposit: DepositDto) {
        const old_deposit = userCheck.deposit
        const new_deposit = +old_deposit + +deposit.deposit
        console.log('old deposit:', old_deposit)
        console.log('new_deposit', new_deposit)
        await this.userModel.updateOne({ username: req.user.name }, { deposit: new_deposit })
    }
}   