import type { MasterCV, Experience } from "../../../types";
import type { JobParsedData, RewriteProvider, RewriteResult } from "./types";

const SWEDISH_STOPWORDS = new Set([
    "och", "att", "som", "en", "ett", "den", "de", "det", "på", "i", "med", "för", "av", "till", "men", "om", "eller", "när", "var", "vid", "från", "ska", "skall", "kan", "vi", "du", "jag", "man", "har", "är", "bli", "blir", "blev", "varit", "skulle", "ha", "kunna", "måste", "komma",
    "heltid", "deltid", "tillsvidare", "visstid", "omfattning", "varaktighet", "anställningsform", "arbetsbeskrivning", "kommun", "stad", "ort", "lön", "ansökan", "ansök", "kontakt", "rekrytering", "personaförmedling", "bahusia", "uddevalla", "trollhättan", "vänersborg", "göteborg",
    "västra", "götalands", "län", "sker", "assistent", "sommarvikarie", "sök", "din", "vår", "oss",
    "lediga", "jobb", "söka", "ansöka", "senast", "referens", "intervju", "urval", "löpande", "plats", "tjänst", "id", "annons", "söker", "vi", "vårt", "vår", "våra", "din", "ditt", "dina", "er", "ert", "era", "senior", "junior", "erfaren", "du", "vill", "hos", "oss", "en", "ett", "med", "ett", "för", "samt", "också", "även", "mellan", "över", "under", "genom", "efter", "före", "mot", "utan", "vid", "från", "till", "inom", "mer", "mest", "många", "flera", "några", "någon", "något", "när", "där", "här", "hur", "varför", "vilken", "vilket", "vilka", "vad", "vem", "vems", "vart", "varifrån", "krav", "meriterande"
]);

export class RuleBasedProvider implements RewriteProvider {
    async rewrite(masterCvJson: MasterCV, jobJson: JobParsedData): Promise<RewriteResult> {
        // 1. Extract tokens from job requirements/keywords and filter noise
        const rawTokens = [
            ...jobJson.requirements,
            ...jobJson.keywords,
            ...jobJson.niceToHave,
            ...jobJson.responsibilities
        ].flatMap(text => text.toLowerCase().split(/[^a-zåäö0-9]+/i));

        const jobTokens = new Set(
            rawTokens
                .map(t => t.replace(/[^a-zåäö0-9]/g, "")) // Strip punctuation from individual tokens
                .filter(token =>
                    token.length > 2 &&
                    !SWEDISH_STOPWORDS.has(token) &&
                    !/^\d+$/.test(token) // No pure numbers
                )
        );

        // 2. Score and reorder experiences and bullets
        const promotedExperiences = masterCvJson.experiences.map((exp: Experience) => {
            const expCombined = `${exp.role} ${exp.company} ${exp.description} ${exp.bullets.join(" ")}`.toLowerCase();
            const expScore = Array.from(jobTokens).filter(token => expCombined.includes(token)).length;

            // Score and reorder bullets within this experience
            const scoredBullets = exp.bullets.map(bullet => {
                const bLower = bullet.toLowerCase();
                const bScore = Array.from(jobTokens).filter(token => bLower.includes(token)).length;

                // Safe rephrasing template (Swedish)
                let tailoredBullet = bullet;
                if (bScore > 0) {
                    if (bullet.toLowerCase().startsWith("stöd för") || bullet.toLowerCase().startsWith("stöttat")) {
                        tailoredBullet = bullet.replace(/stöd för|stöttat/i, "Stöttade verksamheten med") + ", med fokus på effektivitet.";
                    } else if (bullet.toLowerCase().startsWith("ledde") || bullet.toLowerCase().startsWith("projektledare")) {
                        tailoredBullet = bullet.replace(/ledde|projektledare för/i, "Ledde och koordinerade projekt inom") + ", med ansvar för leverans.";
                    }
                }

                return { original: bullet, tailored: tailoredBullet, score: bScore };
            });

            const sortedBullets = [...scoredBullets].sort((a, b) => b.score - a.score);

            return {
                ...exp,
                bullets: sortedBullets.map(b => b.tailored),
                score: expScore,
                originalBullets: exp.bullets,
                tailoredBullets: sortedBullets
            };
        }).sort((a, b) => b.score - a.score);

        // 3. Score and reorder skills
        let allSkills = [...masterCvJson.skills];
        if (allSkills.length === 0 && masterCvJson.rawCvText) {
            const rawLower = masterCvJson.rawCvText.toLowerCase();
            const derivedSkills = Array.from(jobTokens).filter(token =>
                token.length > 3 && rawLower.includes(token)
            );
            allSkills = [...new Set([...allSkills, ...derivedSkills])];
        }

        const scoredSkills = allSkills.map((skill: string) => {
            const matchCount = Array.from(jobTokens).filter(token => skill.toLowerCase().includes(token)).length;
            return { skill, score: matchCount };
        });

        const sortedSkills = [...scoredSkills]
            .sort((a, b) => b.score - a.score)
            .map(s => s.skill);

        // 4. Questions generation (refined missing detection)
        const categories: Record<string, string[]> = {
            "Teknik/Verktyg": [],
            "Certifikat": [],
            "Körkort/Behörighet": [],
            "Övrigt": []
        };

        const CERTS_KEYWORDS = ["certifikat", "license", "licens", "examen", "behörighet"];
        const DRIVING_KEYWORDS = ["körkort", "truck", "kort"];
        const TECH_KEYWORDS = ["erfarenhet", "kunskap", "van", "behärskar", "verktyg", "språk", "framework", "system"];

        jobJson.requirements.forEach((req: string) => {
            const reqLower = req.toLowerCase();

            // When parsed Job is raw sentences, the 'req' might be a full sentence.
            // Let's extract the actual keywords (nouns/skills) from the sentence
            const sentenceTokens = reqLower
                .split(/[^a-zåäö0-9]+/i)
                .filter(t => t.length > 3 && !SWEDISH_STOPWORDS.has(t));

            if (sentenceTokens.length === 0) return;

            // Simple MVP: use the first meaningful token as the core requirement
            // A real NLP model would extract the actual skill Entity here
            const coreReq = sentenceTokens[0];

            const hasReq = masterCvJson.skills.some((skill: string) => skill.toLowerCase() === coreReq) ||
                masterCvJson.experiences.some((exp: Experience) =>
                    exp.role.toLowerCase().includes(coreReq) ||
                    exp.bullets.some((b: string) => b.toLowerCase().includes(coreReq))
                ) ||
                (masterCvJson.rawCvText && masterCvJson.rawCvText.toLowerCase().includes(coreReq));

            if (!hasReq) {
                const displayReq = req.length < 30 ? req : coreReq; // Prettier questions
                const question = `Har du erfarenhet av: ${displayReq}?`;

                if (DRIVING_KEYWORDS.some(kw => reqLower.includes(kw))) {
                    categories["Körkort/Behörighet"].push(question);
                } else if (CERTS_KEYWORDS.some(kw => reqLower.includes(kw))) {
                    categories["Certifikat"].push(question);
                } else if (TECH_KEYWORDS.some(kw => reqLower.includes(kw) || jobTokens.has(coreReq))) {
                    categories["Teknik/Verktyg"].push(question);
                } else {
                    categories["Övrigt"].push(question);
                }
            }
        });

        // Flatten and limit to max 8
        const questions = [
            ...categories["Teknik/Verktyg"].map(text => ({ text, category: "Teknik/Verktyg" })),
            ...categories["Certifikat"].map(text => ({ text, category: "Certifikat" })),
            ...categories["Körkort/Behörighet"].map(text => ({ text, category: "Körkort/Behörighet" })),
            ...categories["Övrigt"].map(text => ({ text, category: "Övrigt" }))
        ].filter(q => {
            const reqText = q.text.replace("Har du erfarenhet av: ", "").replace("?", "");
            return !jobJson.dismissedRequirements?.includes(reqText);
        }).slice(0, 8);

        const tailoredCvJson: MasterCV = {
            ...masterCvJson,
            experiences: promotedExperiences,
            skills: sortedSkills,
        };

        return {
            tailoredCvJson,
            changeLogJson: {
                movedSections: ["Kompetenser anpassades efter relevans"],
                promotedExperiences: promotedExperiences.filter(e => e.score > 0).slice(0, 2).map((e) => e.role),
                removedToOther: [],
                rephrasedBullets: promotedExperiences.flatMap(e =>
                    e.tailoredBullets
                        .filter(b => b.original !== b.tailored)
                        .map(b => ({ before: b.original, after: b.tailored }))
                )
            },
            questions
        };
    }
}
