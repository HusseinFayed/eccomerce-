import { IsIn } from "class-validator";

export class DepositDto {
    
        // @IsIn([5,10,25,50,100])
        deposit:number;
}