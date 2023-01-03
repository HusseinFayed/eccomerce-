import { Controller, Request, Post, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User, UserDocument } from 'src/users/users.model';
import {MailerService} from '@nestjs-modules/mailer'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller()
export class AuthController {
    constructor(private authService: AuthService,
        private mailerService: MailerService,
        @InjectModel('user') private userModel: Model<UserDocument>
        ) { }

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    async login(@Request() req):Promise<any> {
        console.log(req.body)
        return this.authService.login(req.body);
    }

    @UseGuards(AuthGuard('local'))
    @Post('auth/change-password')
    async changePassword(
        @Body('oldpassword') oldpassword: string,
        @Body('newpassword') newpassword: string,
        @Body('username') username: string,
        ):Promise<any>{
        // console.log(req.body)
        return this.authService.changePassword(oldpassword,newpassword,username);
    }

    @Post('forgot-password')
    async forgot(@Body('username') username:string){

        const token = Math.random().toString(20).substring(2,12)
        // console.log(username)
        await this.userModel.updateOne({ username: username } , { change_password_token: token })
        const url = `http://localhost:9000/reset/${token}`;
        await this.mailerService.sendMail({
            to: username,
            subject: 'Reset Your Password',
            html: `Click <a href="${url}">Here</a> To Reset Your Password`
        })
        return{
            message: 'Success'
        }
    }

    @Post('reset-password')
    async reset(
        @Body('token') token:string,
        @Body('password') password:string,
        @Body('password_confirm') password_confirm:string,
    ):Promise<any>
    {
        return this.authService.resetPassword(token,password,password_confirm);
    }
}