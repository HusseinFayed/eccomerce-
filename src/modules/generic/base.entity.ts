import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export abstract class OBaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    @ApiProperty()
    id?: number;
    @CreateDateColumn({ type: 'timestamp' })
    @ApiProperty({ readOnly: true, required: false })
    createdAt?: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    @ApiProperty({ readOnly: true, required: false })
    updatedAt?: Date;
}