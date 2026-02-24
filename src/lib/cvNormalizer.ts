import type { Experience, MasterCV } from "../types";

const SECTION_HEADERS = {
    EXPERIENCE: [/arbetslivserfarenhet/i, /erfarenhet/i, /yrkeserfarenhet/i],
    EDUCATION: [/utbildning/i, /studier/i, /examen/i],
    SKILLS: [/kompetenser/i, /tekniker/i, /verktyg/i, /färdigheter/i, /it-kompetens/i],
    CERTIFICATIONS: [/certifikat/i, /licenser/i, /behörighet/i],
    LANGUAGES: [/språk/i],
    PROJECTS: [/projekt/i],
    OTHER: [/övrigt/i, /förtroendeuppdrag/i],
    REFERENCES: [/referenser/i]
};

const DATE_RANGE_REGEX = /(?:Jan|Feb|Mar|Apr|Maj|Jun|Jul|Aug|Sep|Okt|Nov|Dec|Januari|Februari|Mars|April|Maj|Juni|Juli|Augusti|September|Oktober|November|December|\d{4}|\d{2})\s*(?:20\d{2}|19\d{2})?\s*[–-]\s*(?:Jan|Feb|Mar|Apr|Maj|Jun|Jul|Aug|Sep|Okt|Nov|Dec|Januari|Februari|Mars|April|Maj|Juni|Juli|Augusti|September|Oktober|November|December|\d{4}|\d{2}|nu|pågående|present)\s*(?:20\d{2}|19\d{2})?/i;

export interface NormalizerResult {
    normalizedCv: MasterCV;
    stats: {
        experiences: number;
        skills: number;
        sections: string[];
    };
}

export function normalizeCv(rawText: string): NormalizerResult {
    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const sections: Record<string, string[]> = {
        PROFIL: [],
        EXPERIENCE: [],
        EDUCATION: [],
        SKILLS: [],
        CERTIFICATIONS: [],
        LANGUAGES: [],
        OTHER: [],
        UNMAPPED: []
    };

    let currentSection = "PROFIL";

    // 1. Split into raw sections
    for (const line of lines) {
        let foundSection = false;
        for (const [key, patterns] of Object.entries(SECTION_HEADERS)) {
            if (patterns.some(p => p.test(line) && line.length < 30)) {
                currentSection = key;
                foundSection = true;
                break;
            }
        }

        if (!foundSection) {
            sections[currentSection]?.push(line) || sections["UNMAPPED"].push(line);
        }
    }

    // 2. Parse Experiences
    const experiences = parseExperiences(sections["EXPERIENCE"] || []);

    // 3. Parse Skills
    const skills = parseSkills(sections["SKILLS"] || []);

    // 4. Default MasterCV
    const normalizedCv: MasterCV = {
        rawCvText: rawText,
        profile: sections["PROFIL"].join("\n"),
        experiences,
        education: parseEducation(sections["EDUCATION"] || []),
        skills,
        certifications: sections["CERTIFICATIONS"] || [],
        languages: sections["LANGUAGES"] || [],
        links: []
    };

    return {
        normalizedCv,
        stats: {
            experiences: experiences.length,
            skills: skills.length,
            sections: Object.keys(sections).filter(k => sections[k].length > 0)
        }
    };
}

function parseExperiences(lines: string[]): Experience[] {
    const entries: Experience[] = [];
    let currentEntry: Experience | null = null;

    for (const line of lines) {
        const match = line.match(DATE_RANGE_REGEX);
        const hasDate = !!match;

        if (hasDate || (line.length < 60 && /^[A-ZÅÄÖ]/.test(line) && !currentEntry)) {
            if (currentEntry) entries.push(processBullets(currentEntry));

            let headerPart = line;
            let descriptionPart = "";

            if (match && match.index !== undefined) {
                const dateEndIndex = match.index + match[0].length;
                headerPart = line.substring(0, dateEndIndex);
                descriptionPart = line.substring(dateEndIndex).trim();
                // If it starts with a hyphen/bullet, leave it, processBullets will handle it
            }

            const parts = headerPart.split(/[–-]| - | – /).map(p => p.trim());
            currentEntry = {
                id: crypto.randomUUID(),
                role: parts[0] || "Okänd roll",
                company: parts[1] || "",
                period: parts[2] || (hasDate ? headerPart : ""),
                description: descriptionPart ? descriptionPart + "\n" : "",
                bullets: []
            };
        } else if (currentEntry) {
            currentEntry.description += line + "\n";
        } else {
            // Lines before first entry go to a generic entry or shared text
            currentEntry = {
                id: crypto.randomUUID(),
                role: "Övrig erfarenhet",
                company: "",
                period: "",
                description: line + "\n",
                bullets: []
            };
        }
    }

    if (currentEntry) entries.push(processBullets(currentEntry));
    return entries;
}

function processBullets(exp: Experience): Experience {
    const lines = exp.description.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const bullets: string[] = [];
    let currentDesc = "";

    for (const line of lines) {
        if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
            // Also split inline bullets since the user CV had "- ... - ..." on one line
            const inlineBullets = line.split(/(?:^|\s)[-*•]\s+/).map(s => s.trim()).filter(Boolean);
            bullets.push(...inlineBullets);
        } else {
            currentDesc += line + " ";
        }
    }

    return {
        ...exp,
        description: currentDesc.trim(),
        bullets: bullets.length > 0 ? bullets : (currentDesc ? [currentDesc.trim()] : [])
    };
}

function parseSkills(lines: string[]): string[] {
    // Split by common delimiters
    return lines
        .flatMap(line => line.split(/[,;|•]|\s{2,}/))
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 40);
}

function parseEducation(lines: string[]): any[] {
    // Simple line-based for now
    return lines.map(line => ({
        id: crypto.randomUUID(),
        school: "",
        degree: line,
        period: "",
        description: ""
    }));
}
