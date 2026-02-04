import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { JobsModule } from '../jobs/jobs.module';
import { CvModule } from '../cv/cv.module';
import { AtsModule } from '../ats/ats.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
    JobsModule,
    CvModule,
    AtsModule,
    NotificationsModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
