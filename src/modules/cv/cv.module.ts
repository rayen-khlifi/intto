import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CV, CvSchema } from './schemas/cv.schema';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { AtsModule } from '../ats/ats.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: CV.name, schema: CvSchema }]), AtsModule],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
