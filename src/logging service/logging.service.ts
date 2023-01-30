
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Log } from 'src/models/log.model';
import { ServiceFactory } from 'src/modules/generic/abstract.service';


 
@Injectable()
export default class LogsService extends ServiceFactory<Log>(Log){
  constructor(
    @InjectConnection() private connection: Connection,

  ) {
    super(connection)
  }
 
  async createLog(message) {
    console.log(message)

    const newLog = await this.connection.model<Log>('Log').create(message);
    // await this.connection.model<Log>('Log').create(newLog);
    return newLog;
  }
}