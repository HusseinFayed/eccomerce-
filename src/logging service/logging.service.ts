
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { clearConfigCache } from 'prettier';
import { Log } from 'src/models/log.model';
import { Repository } from 'typeorm';

 
@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>
  ) {}
 
  async createLog(message) {
    const newLog = await this.logsRepository.create(message);
    console.log(newLog)
    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true
      }
    });
    return newLog;
  }
}