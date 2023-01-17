import { IsNotEmpty, Length } from "class-validator";

export class UserDto {
    @IsNotEmpty({ message: 'User Must Have UserName'})
    @Length(3,10)   
    username: string;

    @IsNotEmpty({ message: 'User Must Have Password'})
    @Length(5,100)
    password: string;

    role:string

    deposit:number;
}