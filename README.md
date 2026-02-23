# CVMatch

Ett lokalt verktyg för att skräddarsy ditt svenska CV mot specifika jobb, med full respekt för integritet (lagrar allt i webbläsaren med IndexedDB).

## Funktioner (MVP)
- **Mitt CV (Master)**: Hantera och redigera ditt grund-CV i en strukturerad vy.
- **Jobbhantering**: Klistra in en skärmdump på en jobbannons och använd lokal OCR (Tesseract) för att extrahera texten (eller skriv in manuellt).
- **CV Anpassning**:
  - *Standard (regelbaserad)*: Använder sökorden i jobbannonsen för att flytta upp och betona relevanta delar av ditt CV. Hittar aldrig på ny information.
  - *Ollama (lokalt, AI)*: Frivillig AI-tjänst som körs lokalt på din maskin för att omformulera dina befintliga "claims" till en ännu vassare ton, utan att fabricera kompetenser.
- **Utskrift**: Skapa en ATS-vänlig och ren layout redo för PDF-export (1-kolumn).

## Teknisk Stack
- React + Vite (TypeScript)
- Tailwind CSS & shadcn/ui
- Dexie (IndexedDB)
- Tesseract.js (Lokal OCR)
- Zod & React Hook Form

## Kom igång

### Installera och kör lokalt
\`\`\`bash
npm install
npm run dev
\`\`\`

All data sparas i din webbläsare. Byter du dator, rensar webbinformation eller kör i inkognito behöver du återskapa din data. Appen kommunicerar aldrig mot externa servrar med din data.

### AI Assistans via Ollama (Frivilligt)
Om du vill låta AI omformulera texten (men behålla strikta riktlinjer om att endast använda din befintliga erfarenhet), installera [Ollama](https://ollama.com/) lokalt.
1. Starta Ollama och ladda en språkmodell, t.ex:
   \`\`\`bash
   ollama run qwen2.5:7b
   \`\`\`
2. Välj "Ollama (AI, lokalt)" under *Metod* i CV-anpassaren.
3. Se till att \`http://localhost:11434\` anges i gränssnittet.

*Om Ollama inte svarar eller misslyckas med validering, faller applikationen automatiskt tillbaka till Standard-motorn.*
