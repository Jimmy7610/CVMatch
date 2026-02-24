import { z } from "zod";
import type { MasterCV } from "../../../types";
import type { JobParsedData, ProviderOptions, RewriteProvider, RewriteResult } from "./types";

const OllamaResponseSchema = z.object({
    tailoredCvJson: z.any(), // Should be z.record(), keeping simple for demo
    changeLogJson: z.object({
        movedSections: z.array(z.string()),
        promotedExperiences: z.array(z.string()),
        removedToOther: z.array(z.string()),
        rephrasedBullets: z.array(z.object({
            before: z.string(),
            after: z.string()
        }))
    }),
    usedClaimIds: z.array(z.string()),
    questions: z.array(z.object({
        text: z.string(),
        category: z.string()
    }))
});

export class OllamaProvider implements RewriteProvider {
    async testConnection(options?: ProviderOptions): Promise<boolean> {
        const endpoint = options?.endpoint || 'http://localhost:11434';
        try {
            const res = await fetch(`${endpoint}/api/tags`);
            return res.ok;
        } catch (e) {
            return false;
        }
    }

    async rewrite(masterCvJson: MasterCV, jobJson: JobParsedData, options?: ProviderOptions): Promise<RewriteResult> {
        const endpoint = options?.endpoint || 'http://localhost:11434';
        const model = options?.model || 'qwen2.5:7b';

        // 1. Extract claims list
        const claimsList = masterCvJson.experiences.flatMap(exp =>
            exp.bullets.map((b, i) => `Claim ID: ${exp.id}-B${i}: ${b}`)
        ).join("\n");

        const prompt = `
Du är en professionell svensk CV-skribent. Ditt uppdrag är att anpassa ett CV mot ett specifikt jobb.
DU FÅR ALDRIG HITTA PÅ ERFARENHET ELLER KOMPETENS. Du får enbart använda de "Claims" som finns listade nedan.
Om jobbet kräver något som inte finns med i Claims, måste du lämna det utanför CV:t och istället lägga till det som en "fråga" i "questions".

# Claims (Det enda som får användas som fakta):
${claimsList}

# Jobb:
${jobJson.title}
Krav: ${jobJson.requirements.join(", ")}
Meriterande: ${jobJson.niceToHave.join(", ")}
Nyckelord: ${jobJson.keywords.join(", ")}

Ditt specifika svar måste MÅSTE returneras som VALID JSON med följande struktur exakt, inga extra fält, ingen markdown:
{
  "tailoredCvJson": { /* Original struktur plus dina omformuleringar av erfarenhets arrayer etc., men behåll types */ },
  "changeLogJson": {
    "movedSections": [],
    "promotedExperiences": [],
    "removedToOther": [],
    "rephrasedBullets": [{ "before": "...", "after": "..." }]
  },
  "usedClaimIds": ["..."],
  "questions": ["Har du B-körkort?"]
}
`;

        const res = await fetch(`${endpoint}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
                format: "json"
            })
        });

        if (!res.ok) {
            throw new Error(`Ollama API error: ${res.statusText}`);
        }

        const data = await res.json();
        let parsedJson;
        try {
            parsedJson = JSON.parse(data.response);
        } catch {
            // In case Ollama wrapped JSON in markdown
            const match = data.response.match(/```json\n([\s\S]*?)\n```/);
            if (match) {
                parsedJson = JSON.parse(match[1]);
            } else {
                throw new Error("Kunde inte parsa JSON från Ollama");
            }
        }

        // 2. Validate Schema
        const validated = OllamaResponseSchema.parse(parsedJson);

        // Ensure all used claims exist in master CV
        const validClaimIds = new Set(
            masterCvJson.experiences.flatMap(exp => exp.bullets.map((_, i) => `${exp.id}-B${i}`))
        );

        for (const claimId of validated.usedClaimIds) {
            if (!validClaimIds.has(claimId)) {
                throw new Error(`Ollama fabricerade en claimId: ${claimId}`);
            }
        }

        return {
            tailoredCvJson: validated.tailoredCvJson as MasterCV,
            changeLogJson: validated.changeLogJson,
            questions: validated.questions
        };
    }
}
