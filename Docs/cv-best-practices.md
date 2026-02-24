# CV Best Practices & Rekryterares Förväntningar

Denna guide bygger på etablerad praxis från svenska rekryterare, bemanningsföretag och Arbetsförmedlingen. Syftet är att förstå vad som krävs för att ett CV ska ta sig förbi den första gallringen (som ofta bara tar ett tiotal sekunder) och leda till en intervju.

## Sammanfattning
Ett modernt svenskt CV ska vara skräddarsytt för den sökta rollen, tydligt strukturerat (gärna 1–2 sidor), och fokusera på konkreta resultat och nyckelord istället för klyschor. ATS (Applicant Tracking Systems) används ofta, vilket innebär att enkel, maskinläsbar formatering (som PDF utan komplicerade kolumner och grafik) är avgörande.

## Praktisk Checklista (The "CVMatch" Standard)

För att maximera chansen till intervju bör ett CV uppfylla följande kriterier:

1. **Rätt filformat:** Sparat och skickat som PDF för att bevara layouten och fungera i alla ATS.
2. **Kort och koncist:** Max 1–2 sidor långt. Undvik irrelevanta utfyllnadsjobb om du har lång erfarenhet.
3. **Anpassad Inledning (Profil/Målsättning):** En kort, slagkraftig introduktion högst upp som är direkt kopplad till det sökta jobbet.
4. **Omvänd kronologisk ordning:** Den senaste och mest relevanta erfarenheten och utbildningen ska stå först.
5. **Konkreta prestationer (Inga klyschor):** Används aktiva verb (t.ex. "ansvarade för", "utvecklade", "minskade", "säkerställde") istället för tomma fraser ("har många bollar i luften").
6. **Mätbara resultat:** Arbetsuppgifter ska, där det är möjligt, kvantifieras (t.ex. "ledde ett team på 5 personer", "ökade försäljningen med 10 %").
7. **Tydliga nyckelord:** Ord som efterfrågas i platsannonsen (t.ex. "React", "Körkort B", "Agilt") *måste* finnas med i CV:t om du har kompetensen.
8. **Strukturerad uppställning:** Tydliga, konsekventa rubriker för "Arbetslivserfarenhet", "Utbildning" och "Kompetenser". Punktlistor föredras framför långa textblock.
9. **Avskalad design:** Svart text på vit bakgrund, rimlig marginal, standarfonter (t.ex. Arial, Calibri, Inter). Inga tabeller eller grafik som förvirrar ATS-system.
10. **Tidsangivelser:** År och månad bör framgå för anställningar för att minska tvetydighet kring luckor.
11. **Korrekta kontaktuppgifter:** Namn, telefon, (professionell) e-post och ev. länk till LinkedIn direkt i sidhuvudet.
12. **Ärlighet framför allt:** Inga påhittade meriter. Om ett krav saknas är det bättre att kompensera i det personliga brevet.
13. **Inga onödiga referenser:** "Referenser lämnas på begäran" är standard. Skriv inte ut namn och nummer direkt.

## Hur CVMatch implementerar detta
- **ATS-vänlig Export:** Exporteringsmallen genereras som en ren PDF, formaterad med enkla `<divs>` och rubriker utan komplex layout som stör ATS.
- **Skräddarsydd Profil:** Matchningsmotorn injicerar en automatiskt anpassad inledningsmening baserad på jobbannonsens sökord.
- **Filtrering av irrelevans:** Matchningsalgoritmen rankar och plockar ut de erfarenheter och punktlistor som matchar jobbet bäst, så att CV:t hålls kort (1-2 sidor).
- **CV Coach (Ny funktion):** En inbyggd regelmotor varnar om CV:t saknar profiltext, har för få punktlistor per erfarenhet, saknar datum eller är för långt, och ger konkreta rekommendationer ("Snabba vinster").

---

### Källor
- [Arbetsförmedlingen - Skriv ett bra CV](https://arbetsformedlingen.se/for-arbetssokande/cv-och-ansokan/tips-nar-du-skriver-cv)
- [Bemannia - Rekryterarens 6 bästa tips för ett perfekt CV](https://bemannia.se/2021/01/21/rekryterarens-6-basta-tips-for-ett-perfekt-cv/)
- [Sveriges Ingenjörer - Mallar och tips för CV](https://www.sverigesingenjorer.se/karriar/cv/skriva-cv/)
- [Adecco - Intervjutips och CV-guide](https://www.adecco.se/jobbsokartips/cv/)
- [TNG - Skriv ett CV som ger dig jobbet](https://www.tng.se/soka-jobb/cv-tips/)
