import { Module } from '@nestjs/common';
import { CvParsingService } from './services/cv-parsing.service';
import { RagMatchingService } from './services/rag-matching.service';

@Module({
  providers: [CvParsingService, RagMatchingService],
  exports: [CvParsingService, RagMatchingService],
})
export class AtsModule {}
