import { Body, Controller, Post, Get, Param, UsePipes, ValidationPipe, Patch, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../models/users.model';
import { DepositDto } from '../../dtos/deposit.dto';
import { UserDto } from '../../dtos/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Users')

export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/signup')
    async createUser(@Body() user: UserDto): Promise<User> {
        return await this.usersService.createUser(user)
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Patch('/deposit')
    async deposite(@Req() req, @Body() deposit: DepositDto) {
        const userCheck = await this.usersService.getUserByUserName(req.user.name)
        if (!userCheck) {
            throw new HttpException('No User By That Name', HttpStatus.UNAUTHORIZED)
        }
        return await this.usersService.deposit(req, userCheck, deposit)
    }
}
