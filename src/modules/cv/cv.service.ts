import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as mammoth from 'mammoth';

import { CV, CvDocument } from './schemas/cv.schema';
import { CvParsingService } from '../ats/services/cv-parsing.service';

// ✅ موجود عندك: node_modules/pdfjs-dist/legacy/build/pdf.js
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

@Injectable()
export class CvService {
  private readonly logger = new Logger(CvService.name);

  constructor(
    @InjectModel(CV.name) private readonly cvModel: Model<CvDocument>,
    private readonly parsing: CvParsingService,
  ) {}

  async uploadFile(userId: string, file: Express.Multer.File) {
    try {
      this.logger.log(
        `uploadFile: name=${file?.originalname} mime=${file?.mimetype} size=${file?.size} hasBuffer=${!!file?.buffer}`,
      );

      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid userId in token');
      }

      if (!file?.buffer) {
        throw new BadRequestException(
          'File buffer missing. Ensure memoryStorage() in FileInterceptor.',
        );
      }

      const text = await this.extractText(file);

      if (!text.trim()) {
        throw new BadRequestException(
          'CV has no extractable text (maybe scanned PDF). Try DOCX or text-based PDF.',
        );
      }

      const extractedSkills = this.parsing.extractSkills(text);
      const uid = new Types.ObjectId(userId);

      return await this.cvModel.findOneAndUpdate(
        { userId: uid },
        { userId: uid, filename: file.originalname, text, extractedSkills },
        { upsert: true, new: true },
      );
    } catch (e: any) {
      this.logger.error(e?.message || e, e?.stack);
      throw new BadRequestException(e?.message || 'CV upload failed');
    }
  }

  async getByUserId(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    return this.cvModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
  }

  private async extractText(file: Express.Multer.File): Promise<string> {
    const mime = file.mimetype;

    // ✅ PDF parsing via pdfjs-dist
    if (mime === 'application/pdf') {
      try {
        // ✅ FIX: pdfjs-dist يحتاج Uint8Array مش Buffer
        const data = new Uint8Array(file.buffer);

        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((it: any) => it.str).join(' ') + '\n';
        }

        return fullText;
      } catch (e: any) {
        throw new BadRequestException(`PDF parse failed: ${e?.message || e}`);
      }
    }

    // ✅ DOCX / DOC parsing via mammoth
    if (
      mime ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mime === 'application/msword'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result?.value || '';
      } catch (e: any) {
        throw new BadRequestException(`DOCX parse failed: ${e?.message || e}`);
      }
    }

    throw new BadRequestException('Unsupported file type. Upload PDF/DOCX');
  }
}
