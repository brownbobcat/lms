import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyllabusController } from './syllabus.controller';
import { SyllabusService } from './syllabus.service';
import { Syllabus } from './syllabus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Syllabus])],
  controllers: [SyllabusController],
  providers: [SyllabusService],
})
export class SyllabusModule {}