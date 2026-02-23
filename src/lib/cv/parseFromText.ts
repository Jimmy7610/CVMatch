import type { MasterCV } from "../../types";

export function parseCvFromText(text: string): MasterCV {
    // A very simple heuristic parser.
    // In a real scenario, this would look for keywords like "Utbildning", "Erfarenhet" 
    // and split the text accordingly.
    // We keep it extremely simple for the MVP so it doesn't fabricate structured fields incorrectly.

    const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    const cv: MasterCV = {
        profile: "",
        experiences: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
        links: []
    };

    let currentSection = "profile";

    for (const line of lines) {
        const lowerLine = line.toLowerCase();

        // Detect sections
        if (lowerLine.includes("erfarenhet") || lowerLine.includes("arbetslivserfarenhet")) {
            currentSection = "experiences";
            continue;
        } else if (lowerLine.includes("utbildning")) {
            currentSection = "education";
            continue;
        } else if (lowerLine.includes("kompetens") || lowerLine.includes("färdigheter")) {
            currentSection = "skills";
            continue;
        }

        // Default processing based on section
        if (currentSection === "profile") {
            cv.profile += (cv.profile ? "\n" : "") + line;
        } else if (currentSection === "experiences") {
            // Just dump it into a single experience description for now, user will need to split it
            if (cv.experiences.length === 0) {
                cv.experiences.push({
                    id: crypto.randomUUID(),
                    role: "Okänd",
                    company: "",
                    period: "",
                    description: line,
                    bullets: []
                });
            } else {
                cv.experiences[0].description += "\n" + line;
            }
        } else if (currentSection === "education") {
            if (cv.education.length === 0) {
                cv.education.push({
                    id: crypto.randomUUID(),
                    degree: "Okänd",
                    school: "",
                    period: "",
                    description: line
                });
            } else {
                cv.education[0].description += "\n" + line;
            }
        } else if (currentSection === "skills") {
            // Split by commas or bullets
            const skills = line.split(/[,|•]/).map(s => s.trim()).filter(s => s.length > 0);
            cv.skills.push(...skills);
        }
    }

    return cv;
}
