"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagMatchingService = void 0;
const common_1 = require("@nestjs/common");
let RagMatchingService = class RagMatchingService {
    score(cvSkills, jobSkillsRequired) {
        const a = new Set((cvSkills ?? []).map((s) => s.toLowerCase()));
        const b = new Set((jobSkillsRequired ?? []).map((s) => s.toLowerCase()));
        if (b.size === 0)
            return { score: 0.5, reason: 'No required skills provided; default score applied.' };
        let overlap = 0;
        const matched = [];
        for (const s of b) {
            if (a.has(s)) {
                overlap += 1;
                matched.push(s);
            }
        }
        const score = overlap / b.size;
        const reason = matched.length > 0
            ? `Matched required skills: ${matched.join(', ')}`
            : 'No direct overlap between CV skills and job requirements';
        return { score: Number(score.toFixed(3)), reason };
    }
};
exports.RagMatchingService = RagMatchingService;
exports.RagMatchingService = RagMatchingService = __decorate([
    (0, common_1.Injectable)()
], RagMatchingService);
//# sourceMappingURL=rag-matching.service.js.map