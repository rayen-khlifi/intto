"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvParsingService = void 0;
const common_1 = require("@nestjs/common");
let CvParsingService = class CvParsingService {
    constructor() {
        this.skillDictionary = [
            'node.js',
            'nestjs',
            'express',
            'mongodb',
            'mongoose',
            'postgresql',
            'mysql',
            'jwt',
            'oauth',
            'docker',
            'kubernetes',
            'git',
            'typescript',
            'javascript',
            'python',
            'java',
            'c#',
            'react',
            'next.js',
            'linux',
            'aws',
            'azure',
            'gcp',
            'redis',
            'rabbitmq',
            'microservices',
            'websockets',
        ];
    }
    extractSkills(text) {
        const t = (text ?? '').toLowerCase();
        const found = new Set();
        for (const skill of this.skillDictionary) {
            const token = skill.toLowerCase();
            if (t.includes(token))
                found.add(this.normalize(token));
        }
        return Array.from(found).sort();
    }
    normalize(skill) {
        return skill
            .replace('node.js', 'Node.js')
            .replace('next.js', 'Next.js')
            .replace('nestjs', 'NestJS')
            .toUpperCase() === skill.toUpperCase()
            ? skill
            : skill;
    }
};
exports.CvParsingService = CvParsingService;
exports.CvParsingService = CvParsingService = __decorate([
    (0, common_1.Injectable)()
], CvParsingService);
//# sourceMappingURL=cv-parsing.service.js.map