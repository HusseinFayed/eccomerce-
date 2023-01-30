import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from 'src/models/log.model';
import LogsService from './logging.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Log.name, schema: LogSchema },
    ])
  ],

  providers: [LogsService],
//   controllers: [OrderController],

})
export class LoggingModule { }