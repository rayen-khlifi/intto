"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NlpService = void 0;
const common_1 = require("@nestjs/common");
const skills_json_1 = __importDefault(require("./skills.json"));
let NlpService = class NlpService {
    normalize(text) {
        return (text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9+\s.-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    extractEmail(text) {
        const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        return match?.[0] || null;
    }
    extractPhone(text) {
        const match = text.match(/(\+216\s?)?\d{8}/);
        return match?.[0] || null;
    }
    extractSkills(text) {
        const normalizedText = this.normalize(text);
        const found = new Set();
        for (const skill of skills_json_1.default) {
            const namesToCheck = [skill.name, ...(skill.synonyms || [])];
            for (const name of namesToCheck) {
                const n = this.normalize(name);
                const regex = new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    found.add(skill.name);
                    break;
                }
            }
        }
        return Array.from(found);
    }
    extractSkillsByDomain(text) {
        const skills = this.extractSkills(text);
        const map = {};
        for (const sk of skills) {
            const entry = skills_json_1.default.find((x) => x.name.toLowerCase() === sk.toLowerCase());
            const domain = entry?.domain || 'Other';
            if (!map[domain])
                map[domain] = [];
            map[domain].push(sk);
        }
        return map;
    }
    extractImportantInfo(text) {
        return {
            email: this.extractEmail(text),
            phone: this.extractPhone(text),
            skills: this.extractSkills(text),
            skillsByDomain: this.extractSkillsByDomain(text),
        };
    }
};
exports.NlpService = NlpService;
exports.NlpService = NlpService = __decorate([
    (0, common_1.Injectable)()
], NlpService);
//# sourceMappingURL=nlp.service.js.map