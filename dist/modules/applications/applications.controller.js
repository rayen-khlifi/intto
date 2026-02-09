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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../shared/decorators/roles.decorator");
const role_enum_1 = require("../../shared/enums/role.enum");
const applications_service_1 = require("./applications.service");
const apply_dto_1 = require("./dto/apply.dto");
let ApplicationsController = class ApplicationsController {
    constructor(apps) {
        this.apps = apps;
    }
    apply(req, dto) {
        return this.apps.apply(req.user.userId, dto.jobId);
    }
    listMine(req) {
        return this.apps.listForUser(req.user.userId);
    }
    listCompany(req) {
        return this.apps.listForCompany(req.user.userId);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.JOB_SEEKER),
    (0, common_1.Post)('apply'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, apply_dto_1.ApplyDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "apply", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.JOB_SEEKER),
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "listMine", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.COMPANY),
    (0, common_1.Get)('company'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "listCompany", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('applications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map