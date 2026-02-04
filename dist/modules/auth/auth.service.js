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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const user_schema_1 = require("../users/schemas/user.schema");
const mail_service_1 = require("../mail/mail.service");
function hashOtp(email, code) {
    return (0, crypto_1.createHash)('sha256').update(`${email}:${code}`).digest('hex');
}
let AuthService = class AuthService {
    constructor(userModel, jwt, mail) {
        this.userModel = userModel;
        this.jwt = jwt;
        this.mail = mail;
    }
    async register(dto) {
        const exists = await this.userModel.exists({ email: dto.email.toLowerCase() });
        if (exists)
            throw new common_1.BadRequestException('Email already in use');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.userModel.create({
            email: dto.email.toLowerCase(),
            passwordHash,
            role: dto.role,
            displayName: dto.displayName,
            profile: {},
            isEmailVerified: false,
        });
        const code = String((0, crypto_1.randomInt)(100000, 999999));
        user.emailOtpHash = hashOtp(user.email, code);
        user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        await this.mail.sendOtp(user.email, code);
        const tokens = await this.issueTokens(user.id, user.role);
        return { user: this.sanitize(user), ...tokens };
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isEmailVerified) {
            throw new common_1.BadRequestException('Please check your email first');
        }
        const tokens = await this.issueTokens(user.id, user.role);
        return { user: this.sanitize(user), ...tokens };
    }
    async verifyEmail(email, code) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (user.isEmailVerified) {
            return { message: 'Email already verified' };
        }
        if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
            throw new common_1.BadRequestException('No OTP request found');
        }
        if (user.emailOtpExpiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('OTP expired');
        }
        const incomingHash = hashOtp(user.email, code);
        if (incomingHash !== user.emailOtpHash) {
            throw new common_1.BadRequestException('Invalid code');
        }
        user.isEmailVerified = true;
        user.emailOtpHash = null;
        user.emailOtpExpiresAt = null;
        await user.save();
        await this.mail.sendWelcome(user.email, user.displayName);
        return { message: 'Email verified successfully' };
    }
    async resendOtp(email) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (user.isEmailVerified) {
            return { message: 'Email already verified' };
        }
        const code = String((0, crypto_1.randomInt)(100000, 999999));
        user.emailOtpHash = hashOtp(user.email, code);
        user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        await this.mail.sendOtp(user.email, code);
        return { message: 'OTP sent' };
    }
    async issueTokens(userId, role) {
        const accessToken = await this.jwt.signAsync({ sub: userId, role }, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
        });
        const refreshToken = await this.jwt.signAsync({ sub: userId, role }, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
        });
        return { accessToken, refreshToken };
    }
    sanitize(user) {
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            displayName: user.displayName,
            profile: user.profile ?? {},
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map