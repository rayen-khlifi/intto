import { Injectable } from '@nestjs/common';

/**
 * Academic project version:
 * - In production, parse PDF/DOCX with proper libraries and possibly OCR.
 * - Here, we accept pre-extracted text and do a simple keyword-based skill extraction.
 */
@Injectable()
export class CvParsingService {
  // Minimal curated skills list (extend as needed)
  private readonly skillDictionary = [
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

  extractSkills(text: string): string[] {
    const t = (text ?? '').toLowerCase();
    const found = new Set<string>();

    for (const skill of this.skillDictionary) {
      const token = skill.toLowerCase();
      if (t.includes(token)) found.add(this.normalize(token));
    }

    // naive extra: pick "words" that look like technologies (contains dot or uppercase in original is lost here)
    return Array.from(found).sort();
  }

  private normalize(skill: string) {
    return skill
      .replace('node.js', 'Node.js')
      .replace('next.js', 'Next.js')
      .replace('nestjs', 'NestJS')
      .toUpperCase() === skill.toUpperCase()
      ? skill
      : skill;
  }
}
