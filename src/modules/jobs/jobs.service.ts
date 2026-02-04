import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<JobDocument>) {}

  create(companyUserId: string, dto: CreateJobDto) {
    return this.jobModel.create({
      companyUserId: new Types.ObjectId(companyUserId),
      title: dto.title,
      description: dto.description,
      location: dto.location ?? '',
      skillsRequired: dto.skillsRequired ?? [],
      type: dto.type ?? 'FULL_TIME',
      status: 'OPEN',
    });
  }

  list() {
    return this.jobModel.find({ status: 'OPEN' }).sort({ createdAt: -1 }).exec();
  }

  async get(id: string) {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(companyUserId: string, id: string, dto: UpdateJobDto) {
    const job = await this.get(id);
    if (job.companyUserId.toString() !== companyUserId) throw new ForbiddenException('Not your job posting');

    Object.assign(job, {
      ...(dto.title ? { title: dto.title } : {}),
      ...(dto.description ? { description: dto.description } : {}),
      ...(dto.location ? { location: dto.location } : {}),
      ...(dto.skillsRequired ? { skillsRequired: dto.skillsRequired } : {}),
      ...(dto.type ? { type: dto.type } : {}),
    });

    return job.save();
  }

  async remove(companyUserId: string, id: string) {
    const job = await this.get(id);
    if (job.companyUserId.toString() !== companyUserId) throw new ForbiddenException('Not your job posting');
    await this.jobModel.deleteOne({ _id: job._id }).exec();
    return { deleted: true };
  }
}
