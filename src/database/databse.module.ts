import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { DatabaseService } from './databse.service';

let dbName = process.env.DB_NAME;
if (process.env.NODE_ENV == 'test') {
    dbName = 'cakeTest'
}
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            // inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                // logger: new DatabaseLogger(),
                uri: configService.get<string>('LOGS_DB') 
                    ? configService.get<string>('DB_TEST_URL')
                    : configService.get<string>('DB_URL'),
                useUnifiedTopology: true

            }),

            inject: [ConfigService]
        }),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService]
})
export class DatabaseModule { }