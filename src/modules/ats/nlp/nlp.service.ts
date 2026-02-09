import { Injectable } from '@nestjs/common';
import skillsDb from './skills.json';

type SkillEntry = {
  name: string;
  synonyms?: string[];
  domain?: string;
};

@Injectable()
export class NlpService {
  
  private normalize(text: string) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9+\s.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  
  extractEmail(text: string): string | null {
    const match = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    return match?.[0] || null;
  }

  
  extractPhone(text: string): string | null {
    const match = text.match(/(\+216\s?)?\d{8}/);
    return match?.[0] || null;
  }

  
  extractSkills(text: string): string[] {
    const normalizedText = this.normalize(text);

    const found = new Set<string>();

    for (const skill of skillsDb as SkillEntry[]) {
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

  
  extractSkillsByDomain(text: string) {
    const skills = this.extractSkills(text);

    const map: Record<string, string[]> = {};
    for (const sk of skills) {
      const entry = (skillsDb as SkillEntry[]).find(
        (x) => x.name.toLowerCase() === sk.toLowerCase(),
      );

      const domain = entry?.domain || 'Other';
      if (!map[domain]) map[domain] = [];
      map[domain].push(sk);
    }

    return map;
  }

  
  extractImportantInfo(text: string) {
    return {
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      skills: this.extractSkills(text),
      skillsByDomain: this.extractSkillsByDomain(text),
    };
  }
}
