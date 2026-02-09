"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CvService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mammoth = __importStar(require("mammoth"));
const cv_schema_1 = require("./schemas/cv.schema");
const cv_parsing_service_1 = require("../ats/services/cv-parsing.service");
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
let CvService = CvService_1 = class CvService {
    constructor(cvModel, parsing) {
        this.cvModel = cvModel;
        this.parsing = parsing;
        this.logger = new common_1.Logger(CvService_1.name);
    }
    async uploadFile(userId, file) {
        try {
            this.logger.log(`uploadFile: name=${file?.originalname} mime=${file?.mimetype} size=${file?.size} hasBuffer=${!!file?.buffer}`);
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid userId in token');
            }
            if (!file?.buffer) {
                throw new common_1.BadRequestException('File buffer missing. Ensure memoryStorage() in FileInterceptor.');
            }
            const text = await this.extractText(file);
            if (!text.trim()) {
                throw new common_1.BadRequestException('CV has no extractable text (maybe scanned PDF). Try DOCX or text-based PDF.');
            }
            const extractedSkills = this.parsing.extractSkills(text);
            const uid = new mongoose_2.Types.ObjectId(userId);
            return await this.cvModel.findOneAndUpdate({ userId: uid }, { userId: uid, filename: file.originalname, text, extractedSkills }, { upsert: true, new: true });
        }
        catch (e) {
            this.logger.error(e?.message || e, e?.stack);
            throw new common_1.BadRequestException(e?.message || 'CV upload failed');
        }
    }
    async getByUserId(userId) {
        if (!mongoose_2.Types.ObjectId.isValid(userId)) {
            throw new common_1.BadRequestException('Invalid userId');
        }
        return this.cvModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId) }).exec();
    }
    async extractText(file) {
        const mime = file.mimetype;
        if (mime === 'application/pdf') {
            try {
                const data = new Uint8Array(file.buffer);
                const loadingTask = pdfjsLib.getDocument({ data });
                const pdf = await loadingTask.promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    fullText += content.items.map((it) => it.str).join(' ') + '\n';
                }
                return fullText;
            }
            catch (e) {
                throw new common_1.BadRequestException(`PDF parse failed: ${e?.message || e}`);
            }
        }
        if (mime ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mime === 'application/msword') {
            try {
                const result = await mammoth.extractRawText({ buffer: file.buffer });
                return result?.value || '';
            }
            catch (e) {
                throw new common_1.BadRequestException(`DOCX parse failed: ${e?.message || e}`);
            }
        }
        throw new common_1.BadRequestException('Unsupported file type. Upload PDF/DOCX');
    }
};
exports.CvService = CvService;
exports.CvService = CvService = CvService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cv_schema_1.CV.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cv_parsing_service_1.CvParsingService])
], CvService);
//# sourceMappingURL=cv.service.js.map