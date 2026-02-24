import fs from 'fs';

const text = `Jimmy Eliasson CV och personligt brev
Adress: Helenedalsvägen 16h, 45154 Uddevalla
Telefon: 0767905120
E-post: eliassonjimmy76@gmail.com
Målsättning
Att utvecklas i en roll inom teknik eller projektledning, där jag kan bidra med min erfarenhet och effektivitet.
Arbetslivserfarenhet
Fyrstads Entek Projektledare Mars 2023 – Juni 2023 - Ledde projekt för fiberutbyggnad i Lilla Edet och Vänersborg. - Tog över projekt från tidigare entreprenör och säkrade leverans.
Uddevalla Kommun It-tekniker Augusti 2020 – Mars 2023 - Stöd för videokonferenser, datorer och annan teknik. - Underlättade tekniska lösningar för lärare och elever.
Eltel Networks Infranet AB Teamledare Januari 2018 – Januari 2020 - Personalansvar och koordinering av fiberprojekt. - Stöd till tekniker inom IT och telefonilösningar.
Produktionsplanerare/Projektör 2016 – 2018 - Planerade produktionen och hanterade administrativa uppgifter. - Ansvarade för egna fiberprojekt.
Fibertekniker 2007 – 2016 - Fibersvetsning och arbete i Telia Skanova-nät.
Utbildning
- Hjärt- och lungräddning (2023) - BB1-certifiering - El- och teleteknisk inriktning, Birger Sjöbergsgymnasiet (1992–1995)
Kompetenser
- Språk: Svenska (modersmål), engelska (flytande). - IT-kunskaper: Office-paketet, ENAS och dokumentationssystem. - Erfarenhet av projektledning, teknisk support och IT-lösningar.
Övrigt
- B-körkort. - Referenser lämnas på begäran.`;

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

function normalizeCv(rawText) {
    const lines = rawText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const sections = {
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
            sections[currentSection] ? sections[currentSection].push(line) : sections["UNMAPPED"].push(line);
        }
    }

    console.log("SECTIONS:", Object.keys(sections).map(k => k + ": " + sections[k].length));

    const experiences = parseExperiences(sections["EXPERIENCE"] || []);
    console.log("EXPERIENCES:", JSON.stringify(experiences, null, 2));
}

function parseExperiences(lines) {
    const entries = [];
    let currentEntry = null;

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
            }

            const parts = headerPart.split(/[–-]| - | – /).map(p => p.trim());
            currentEntry = {
                id: 1,
                role: parts[0] || "Okänd roll",
                company: parts[1] || "",
                period: parts[2] || (hasDate ? headerPart : ""),
                description: descriptionPart ? descriptionPart + "\n" : "",
                bullets: []
            };
        } else if (currentEntry) {
            currentEntry.description += line + "\n";
        }
    }

    if (currentEntry) entries.push(processBullets(currentEntry));
    return entries;
}

function processBullets(exp) {
    const lines = exp.description.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    const bullets = [];
    let currentDesc = "";

    for (const line of lines) {
        if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
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

normalizeCv(text);
