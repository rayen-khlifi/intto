import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { JobsService } from '../jobs/jobs.service';
import { CvService } from '../cv/cv.service';
import { RagMatchingService } from '../ats/services/rag-matching.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private readonly appModel: Model<ApplicationDocument>,
    private readonly jobs: JobsService,
    private readonly cv: CvService,
    private readonly rag: RagMatchingService,
    private readonly ws: NotificationsGateway,
  ) {}

  async apply(candidateUserId: string, jobId: string) {
    const job = await this.jobs.get(jobId);
    if (!job) throw new NotFoundException('Job not found');

const cv = await this.cv.getByUserId(candidateUserId);
    if (!cv) throw new BadRequestException('Please upload your CV before applying');

    const { score, reason } = this.rag.score(cv.extractedSkills, job.skillsRequired);

    const created = await this.appModel.create({
      jobId: new Types.ObjectId(jobId),
      candidateUserId: new Types.ObjectId(candidateUserId),
      companyUserId: job.companyUserId,
      status: 'APPLIED',
      score,
      reason,
    });

    // Notify company in realtime
    this.ws.emitToUser(job.companyUserId.toString(), 'application:new', {
      jobId,
      candidateUserId,
      score,
      reason,
    });

    return created;
  }

  listForUser(userId: string) {
    return this.appModel
      .find({ candidateUserId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  listForCompany(companyUserId: string) {
    return this.appModel
      .find({ companyUserId: new Types.ObjectId(companyUserId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
