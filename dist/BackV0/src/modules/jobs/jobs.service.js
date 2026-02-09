"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const job_schema_1 = require("./schemas/job.schema");
let JobsService = class JobsService {
    constructor(jobModel) {
        this.jobModel = jobModel;
    }
    create(companyUserId, dto) {
        return this.jobModel.create({
            companyUserId: new mongoose_2.Types.ObjectId(companyUserId),
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
    async get(id) {
        const job = await this.jobModel.findById(id).exec();
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return job;
    }
    async update(companyUserId, id, dto) {
        const job = await this.get(id);
        if (job.companyUserId.toString() !== companyUserId)
            throw new common_1.ForbiddenException('Not your job posting');
        Object.assign(job, {
            ...(dto.title ? { title: dto.title } : {}),
            ...(dto.description ? { description: dto.description } : {}),
            ...(dto.location ? { location: dto.location } : {}),
            ...(dto.skillsRequired ? { skillsRequired: dto.skillsRequired } : {}),
            ...(dto.type ? { type: dto.type } : {}),
        });
        return job.save();
    }
    async remove(companyUserId, id) {
        const job = await this.get(id);
        if (job.companyUserId.toString() !== companyUserId)
            throw new common_1.ForbiddenException('Not your job posting');
        await this.jobModel.deleteOne({ _id: job._id }).exec();
        return { deleted: true };
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(job_schema_1.Job.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], JobsService);
//# sourceMappingURL=jobs.service.js.map