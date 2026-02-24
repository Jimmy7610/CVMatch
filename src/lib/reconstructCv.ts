import type { MasterCV } from "../types";
import { normalizeCv } from "./cvNormalizer";

export interface ReconstructResult {
    normalizedMasterCvJson: MasterCV;
    extractedSkills: string[];
    changeLog: {
        experiencesSplit: number;
        bulletsCreated: number;
        suggestedSkills: string[];
    };
}

export function reconstructCv(currentCv: MasterCV): ReconstructResult {
    // 1. If we have raw text, use it as the source of truth for the best possible reconstruction
    // Otherwise, serialize the JSON back to a raw text format to feed through the normalizer.
    const sourceText = currentCv.rawCvText || serializeCvToText(currentCv);

    // 2. Run the deterministic normalizer
    const result = normalizeCv(sourceText);
    const newCv = result.normalizedCv;

    // 3. Keep existing valid data if the normalizer missed it (e.g., already defined profile)
    if (!newCv.profile && currentCv.profile) {
        newCv.profile = currentCv.profile;
    }

    // 4. Calculate diffs for the changelog
    const oldExpCount = currentCv.experiences.length;
    const newExpCount = newCv.experiences.length;

    const oldBulletCount = currentCv.experiences.reduce((acc, exp) => acc + exp.bullets.length, 0);
    const newBulletCount = newCv.experiences.reduce((acc, exp) => acc + exp.bullets.length, 0);

    // 5. Skills extraction
    // We don't blindly overwrite the user's existing skills unless they were empty.
    // Instead, we suggest the newly found skills that aren't already in the list.
    const existingSkillsLower = new Set(currentCv.skills.map(s => s.toLowerCase()));

    let suggestedSkills: string[] = [];
    if (currentCv.skills.length === 0) {
        // If they had no skills, just apply them directly
        newCv.skills = newCv.skills.length > 0 ? newCv.skills : currentCv.skills;
    } else {
        // Find new skills that the normalizer picked up
        suggestedSkills = newCv.skills.filter(s => !existingSkillsLower.has(s.toLowerCase()));
        // Keep existing skills in the CV
        newCv.skills = currentCv.skills;
    }

    return {
        normalizedMasterCvJson: newCv,
        extractedSkills: newCv.skills,
        changeLog: {
            experiencesSplit: Math.max(0, newExpCount - oldExpCount),
            bulletsCreated: Math.max(0, newBulletCount - oldBulletCount),
            suggestedSkills
        }
    };
}

function serializeCvToText(cv: MasterCV): string {
    let parts: string[] = [];

    if (cv.profile) {
        parts.push("Profil\n" + cv.profile);
    }

    if (cv.experiences.length > 0) {
        parts.push("Arbetslivserfarenhet");
        for (const exp of cv.experiences) {
            parts.push(`${exp.role} ${exp.company} ${exp.period}`);
            if (exp.description) parts.push(exp.description);
            if (exp.bullets.length > 0) parts.push(exp.bullets.map(b => `- ${b}`).join("\n"));
        }
    }

    if (cv.education.length > 0) {
        parts.push("Utbildning");
        for (const edu of cv.education) {
            parts.push(`${edu.degree} ${edu.school} ${edu.period}`);
            if (edu.description) parts.push(edu.description);
        }
    }

    if (cv.skills.length > 0) {
        parts.push("Kompetenser\n" + cv.skills.join(", "));
    }

    return parts.join("\n\n");
}
