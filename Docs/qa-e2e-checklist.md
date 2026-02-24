# CVMatch End-to-End (E2E) Quality Assurance Checklist

För att säkerställa att CVMatch fungerar felfritt och ger det förväntade värdet (skräddarsydda CV:n och insiktsfull coaching) måste denna E2E-rutin följas när större ändringar görs.

## Nollställning (Dev Helper)
Innan du påbörjar testet, nollställ den lokala databasen (IndexedDB) för att börja om på ny kula.
1. Gå till webbläsarens **Utvecklarverktyg (F12)**.
2. Navigera till fliken **Application** (Chrome/Edge) eller **Storage** (Firefox).
3. Under **IndexedDB**, expandera `CVMatchDB`.
4. Klicka på "Delete database" (Chrome) eller högerklicka och välj "Delete" för att rensa all testdata.
5. Ladda om sidan med `F5`.

## E2E Testflöde

### A. Importera Master CV
1. Navigera till appen och gå till "Mitt CV" (eller startsidan).
2. Ladda upp ett CV (PDF/DOCX) eller klistra in en ren textkopia av ett Master CV.
3. Klicka på "Spara & Granska nedan".
4. **Verifera:**
   - [ ] Importmodulen visar omedelbart "Vi tolkade ditt CV" med en sammanfattning (x antal erfarenheter, y kompetenser).
   - [ ] Appen rullar ner till "Granska och justera".
   - [ ] Redigeraren visar det extraherade datat (Erfarenheter, Kompetenser, Utbildningar) utan konstiga tecken eller avhuggna ord.

### B. Lägga till ett Jobb
1. Gå till "Jobb" och klicka fram "Nytt Jobb".
2. Klistra in text från en annons ELLER ange en giltig Arbetsförmedlingen-URL under "Jobblänk" och klicka "Hämta text".
   *Om CORS blockerar URL:en, kontrollera att felmeddelandet uppmanar till manuell kopiering.*
3. Spara jobbet med en Titel (t.ex. "Maskinmontör") och Företagskraft.

### C. Generera skräddarsytt CV
1. Klicka på "Matcha CV" för det nya jobbet.
2. Välj "Standard (regelbaserat)" i dropdown-menyn.
3. Klicka på "Skapa anpassat CV".
4. **Verifera:**
   - [ ] Laddningsindikator visas och försvinner.
   - [ ] Resultatvyn (MatchPreview, ChangeLog, CV Coach) visas automatiskt efter genereringen.

### D. Granska UI och Exportering (The "Wow" Factor)
1. **MatchPreview (Före/Efter):**
   - [ ] Granska fliken/vyn för "Före/Efter".
   - [ ] Är det tydligt vad som har omstrukturerats?
2. **ChangeLog:**
   - [ ] Visar ändringsloggen specifika, konkreta händelser? (t.ex. "Lade till personlig inledning", "Flyttade upp erfarenhet X", "Lyfte fram punkt Y").
   - [ ] Om underlaget var för tunt, förklarar loggen varför inga större ändringar gjordes?
3. **Automatiska frågor:**
   - [ ] Känns frågorna i "Frågor & Påståenden" relevanta baserat på jobbannonsen? Inga orelaterade fyllnadsord.
4. **PDF Export:**
   - [ ] Klicka på "Visa PDF" och skriv ut till PDF.
   - [ ] Följer PDF:en best practices? (Endast en kolumn, max 1-2 sidor, inga röriga fonter, ren layout).
   - [ ] Finns den nyskapade målsättningen/profiltexten med i sidhuvudet?

### E. CV Coaching Feedback
1. Studera panelen "CV Coach".
2. **Verifera ton och innehåll:**
   - [ ] **Styrkor:** Finns det minst en positiv egenskap/styrka baserad på Master CV:ts struktur (t.ex. bra längd, många resultatpunkter)?
   - [ ] **Förbättra:** Finns det minst 1-2 konstruktiva förslag (t.ex. "Du saknar kontaktuppgifter", "Roll X saknar punkter")?
   - [ ] **Snabba vinster:** Uppmuntras konkreta "quick fixes" (t.ex. "Lägg till nyckelord Y som annonsen frågar efter") utan att verka orealistiskt positiva eller robotaktiga?
   - [ ] Inga påhittade erfarenheter rekommenderas (systemet uppmanar till *komplettering av sanningen*, inte att fabricera).
