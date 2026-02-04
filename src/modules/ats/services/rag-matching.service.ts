import { Injectable } from '@nestjs/common';

/**
 * Mock RAG service:
 * - "Retrieve" step is simulated by selecting overlaps between CV skills and job required skills.
 * - "Generate" step is simulated by producing a short reason/explanation.
 *
 * You can later replace this with a real vector database + LLM provider.
 */
@Injectable()
export class RagMatchingService {
  score(cvSkills: string[], jobSkillsRequired: string[]) {
    const a = new Set((cvSkills ?? []).map((s) => s.toLowerCase()));
    const b = new Set((jobSkillsRequired ?? []).map((s) => s.toLowerCase()));

    if (b.size === 0) return { score: 0.5, reason: 'No required skills provided; default score applied.' };

    let overlap = 0;
    const matched: string[] = [];
    for (const s of b) {
      if (a.has(s)) {
        overlap += 1;
        matched.push(s);
      }
    }

    const score = overlap / b.size; // 0..1
    const reason =
      matched.length > 0
        ? `Matched required skills: ${matched.join(', ')}`
        : 'No direct overlap between CV skills and job requirements';

    return { score: Number(score.toFixed(3)), reason };
  }
}
