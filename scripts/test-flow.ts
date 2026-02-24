import fs from 'fs';
import * as cheerio from 'cheerio';
// In a real env this would run in Node and use exactly the same normalization logic as the frontend
import { normalizeCv } from './src/lib/cvNormalizer.js';

// We'll write this script as a dirty test rig using ts-node since the app is TS
const rawCvText = `Jimmy Eliasson CV och personligt brev
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

const html = fs.readFileSync('job.html', 'utf8');

// The AF page might be tricky to parse if it's SPA rendered, but let's try
const $ = cheerio.load(html);

// We need a script to put it in indexeddb. A Node script can't access Chrome's IndexedDB easily.
// Instead, let's write an IIFE that we can inject or copy-paste into the browser console!
const consoleScript = \`
(async function() {
    console.log("Starting test flow injected script...");

    // 1. CV Text
    const rawCvText = \`\${rawCvText}\`;

    // Normalize
    // We can't import directly in console easily unless we expose it, but we can do a poor man's mock or 
    // we can add a test endpoint to the app? No, simpler: Let's create a temporary React component that runs on mount if a flag is set.
})();
\`;

console.log(consoleScript);
