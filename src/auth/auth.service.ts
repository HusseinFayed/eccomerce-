import { Injectable, NotAcceptableException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from 'src/users/users.model';
import mongoose, { Model } from "mongoose";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService,
        @InjectModel('user') private userModel: Model<UserDocument>) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.getUser({ username });
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }
    async login(user: any) {
        const payload = { username: user.username, sub: user._id };
			const token =  this.jwtService.sign({
				name: user.username,
			})
            console.log(user.username)
            await this.userModel.updateOne({ username: user.username } , { user_token: token })
            const recorded_token = await this.userModel.findOne({ username: user.username })
            .select('user_token').exec();
            console.log(recorded_token)
            
            const refreshToken = await this.jwtService.signAsync({
                id: user.id
            })
            return token;
    }
    async changePassword(oldpassword: string,newpassword: string,username: string ){
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(newpassword, saltOrRounds);
        await this.userModel.updateOne({ username: username } , { password: hashedPassword })
    }

    async resetPassword(token: string, password: string ,password_confirm: string){
        if(password !==password_confirm){
            throw new BadRequestException("Password Not Match!!")
        }
        const reset = await this.userModel.findOne({change_password_token:token})
        console.log("From Database:",reset.change_password_token)
        console.log("From Request:",token)

        if(token === reset.change_password_token){
            // console.log("OK")
            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltOrRounds);
            await this.userModel.updateOne({ username: reset.username } , { password: hashedPassword })
        }
}
}