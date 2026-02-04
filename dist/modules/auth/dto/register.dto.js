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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const role_enum_1 = require("../../../shared/enums/role.enum");
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'rayen@example.com' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email obligatoire' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email not correcte' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ minLength: 8 }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mot de passe obligatoire' }),
    (0, class_validator_1.MinLength)(8, { message: 'Mot de passe minimum 8 caractères' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_enum_1.Role, example: role_enum_1.Role.JOB_SEEKER }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role obligatoire' }),
    (0, class_validator_1.IsEnum)(role_enum_1.Role, { message: 'Role is not found' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rayen Khelifi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Display name obligatoire' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "displayName", void 0);
//# sourceMappingURL=register.dto.js.map