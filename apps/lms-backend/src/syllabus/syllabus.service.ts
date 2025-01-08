import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Syllabus } from './syllabus.entity';
import { createReadStream, unlink } from 'fs';
import { promisify } from 'util';
import { Request } from 'express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const unlinkAsync = promisify(unlink);

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class SyllabusService {
  constructor(
    @InjectRepository(Syllabus)
    private syllabusRepository: Repository<Syllabus>,
  ) {}

  getMulterOptions(): MulterOptions {
    return {
      dest: './uploads/syllabus',
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req: Request, file: MulterFile, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.mimetype.match(/(pdf|doc|docx)$/)) {
          callback(null, false);
          return;
        }
        callback(null, true);
      }
    };
  }

  async saveSyllabus(file: MulterFile) {
    const syllabus = new Syllabus();
    syllabus.name = file.originalname;
    syllabus.type = file.mimetype;
    syllabus.size = file.size;
    syllabus.path = file.path;

    return this.syllabusRepository.save(syllabus);
  }

  async getAllSyllabus() {
    return this.syllabusRepository.find();
  }

  async getSyllabus(id: number) {
    const syllabus = await this.syllabusRepository.findOne({ where: { id } });
    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }
    return syllabus;
  }

  async deleteSyllabus(id: number) {
    const syllabus = await this.getSyllabus(id);
    await unlinkAsync(syllabus.path);
    await this.syllabusRepository.remove(syllabus);
    return { success: true };
  }

  getSyllabusStream(syllabus: Syllabus) {
    return createReadStream(syllabus.path);
  }
}