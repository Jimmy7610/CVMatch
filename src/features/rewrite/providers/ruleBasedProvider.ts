import type { MasterCV } from "../../../types";
import type { JobParsedData, RewriteProvider, RewriteResult } from "./types";

export class RuleBasedProvider implements RewriteProvider {
    async rewrite(masterCvJson: MasterCV, jobJson: JobParsedData): Promise<RewriteResult> {
        // 1. Extract tokens from job requirements/keywords
        const jobTokens = new Set(
            [...jobJson.requirements, ...jobJson.keywords, ...jobJson.niceToHave, ...jobJson.responsibilities]
                .flatMap(text => text.toLowerCase().split(/[^a-zåäö0-9]+/i))
                .filter(token => token.length > 2)
        );

        // 2. Score and reorder experiences
        const scoredExperiences = masterCvJson.experiences.map(exp => {
            const expText = `${exp.role} ${exp.description} ${exp.bullets.join(" ")}`.toLowerCase();
            const matchCount = Array.from(jobTokens).filter(token => expText.includes(token)).length;
            return { ...exp, score: matchCount };
        });

        const promotedExperiences = [...scoredExperiences]
            .sort((a, b) => b.score - a.score)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ score, ...exp }) => exp);

        // 3. Score and reorder skills
        const scoredSkills = masterCvJson.skills.map(skill => {
            const matchCount = Array.from(jobTokens).filter(token => skill.toLowerCase().includes(token)).length;
            return { skill, score: matchCount };
        });

        const sortedSkills = [...scoredSkills]
            .sort((a, b) => b.score - a.score)
            .map(s => s.skill);

        // 4. Questions generation (simple heuristic: look for missing keywords required by job)
        // In a real scenario, this would check against confirmed user data.
        const questions: string[] = [];
        jobJson.requirements.forEach(req => {
            const hasReq = masterCvJson.skills.some(skill => skill.toLowerCase() === req.toLowerCase()) ||
                masterCvJson.experiences.some(exp => exp.bullets.some(b => b.toLowerCase().includes(req.toLowerCase())));
            if (!hasReq) {
                questions.push(`Har du erfarenhet av: ${req}?`);
            }
        });

        const tailoredCvJson: MasterCV = {
            ...masterCvJson,
            experiences: promotedExperiences,
            skills: sortedSkills,
        };

        return {
            tailoredCvJson,
            changeLogJson: {
                movedSections: ["Kompetenser anpassades efter relevans"],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                promotedExperiences: promotedExperiences.map((e) => e.role),
                removedToOther: [],
                rephrasedBullets: []
            },
            questions
        };
    }
}
