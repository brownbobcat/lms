import { Controller, Get, Post, Delete, Param, UseInterceptors, UploadedFile, Res, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SyllabusService } from './syllabus.service';

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

@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads/syllabus',
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/(pdf|doc|docx)$/)) {
        cb(null, false);
        return;
      }
      cb(null, true);
    }
  }))
  async uploadSyllabus(@UploadedFile() file: MulterFile) {
    return this.syllabusService.saveSyllabus(file);
  }

  @Get()
  async getAllSyllabus() {
    return this.syllabusService.getAllSyllabus();
  }

  @Get(':id/download')
  async downloadSyllabus(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const syllabus = await this.syllabusService.getSyllabus(id);
    const stream = this.syllabusService.getSyllabusStream(syllabus);
    
    res.set({
      'Content-Type': syllabus.type,
      'Content-Disposition': `attachment; filename="${syllabus.name}"`,
    });
    
    stream.pipe(res);
  }

  @Delete(':id')
  async deleteSyllabus(@Param('id', ParseIntPipe) id: number) {
    return this.syllabusService.deleteSyllabus(id);
  }
}