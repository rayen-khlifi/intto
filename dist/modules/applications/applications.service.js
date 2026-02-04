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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const application_schema_1 = require("./schemas/application.schema");
const jobs_service_1 = require("../jobs/jobs.service");
const cv_service_1 = require("../cv/cv.service");
const rag_matching_service_1 = require("../ats/services/rag-matching.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let ApplicationsService = class ApplicationsService {
    constructor(appModel, jobs, cv, rag, ws) {
        this.appModel = appModel;
        this.jobs = jobs;
        this.cv = cv;
        this.rag = rag;
        this.ws = ws;
    }
    async apply(candidateUserId, jobId) {
        const job = await this.jobs.get(jobId);
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const cv = await this.cv.getByUserId(candidateUserId);
        if (!cv)
            throw new common_1.BadRequestException('Please upload your CV before applying');
        const { score, reason } = this.rag.score(cv.extractedSkills, job.skillsRequired);
        const created = await this.appModel.create({
            jobId: new mongoose_2.Types.ObjectId(jobId),
            candidateUserId: new mongoose_2.Types.ObjectId(candidateUserId),
            companyUserId: job.companyUserId,
            status: 'APPLIED',
            score,
            reason,
        });
        this.ws.emitToUser(job.companyUserId.toString(), 'application:new', {
            jobId,
            candidateUserId,
            score,
            reason,
        });
        return created;
    }
    listForUser(userId) {
        return this.appModel
            .find({ candidateUserId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    listForCompany(companyUserId) {
        return this.appModel
            .find({ companyUserId: new mongoose_2.Types.ObjectId(companyUserId) })
            .sort({ createdAt: -1 })
            .exec();
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(application_schema_1.Application.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jobs_service_1.JobsService,
        cv_service_1.CvService,
        rag_matching_service_1.RagMatchingService,
        notifications_gateway_1.NotificationsGateway])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map