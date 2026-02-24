import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/db";
import { normalizeCv } from "../lib/cvNormalizer";

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
- B-körkort. - Referenser lämnas på begäran.
Jimmy Eliasson CV och personligt brev
Adress: Helenedalsvägen 16h, 45154 Uddevalla
Telefon: 0767905120
E-post: eliassonjimmy76@gmail.com
Hej,
Jag heter Jimmy Eliasson och är en teknikälskare som bor i Uddevalla tillsammans med min sambo och vår son. Jag har alltid haft ett stort intresse för teknik och problemlösning, och det är något som har följt med mig genom hela min karriär.
Under åren har jag jobbat i olika roller inom IT och teknik, från fibertekniker till projektledare. Det har gett mig en bred erfarenhet och ett öga för hur saker och ting fungerar – och hur de kan göras bättre. Jag trivs bäst när jag får jobba i team, lösa problem och se konkreta resultat av det jag gör.
Det jag gillar med teknik är att det aldrig står still – det finns alltid något nytt att lära sig. Jag är bra på att snabbt sätta mig in i nya arbetsuppgifter och hitta lösningar, och jag försöker alltid göra jobbet så smidigt som möjligt, både för mig själv och för andra.
På fritiden är jag en familjeperson. Min son håller mig aktiv, och när jag inte jagar honom runt huset så gillar jag att fixa saker hemma eller bara koppla av med en bra film. För mig är det viktigt att ha en bra balans mellan jobb och fritid, något som också hjälper mig att vara effektiv och fokuserad i det jag gör.
Den sista tiden när jag inte har jobbat så har jag varit hemma med min son och även pluggat upp lite betyg från skolan. Jag har läst på distans på Uddevalla vuxenutbildning.
Jag ser fram emot att få bidra med min erfarenhet och min vilja att ständigt utvecklas hos er. Tack för att ni tar er tid att läsa detta, och jag hoppas vi hörs snart!
Med vänliga hälsningar, Jimmy Eliasson`;

const jobData = {
    title: "Maskinmontör till UFAB",
    company: "Bahusia Personalförmedling AB",
    originalText: `Om kunden UFAB
    Sedan 1968 har UFAB levererat kvalificerade systemlösningar till en rad olika krävande kunder över hela världen – företag inom allt från medicinteknik till förpackningsindustri. UFAB tar ansvar för hela värdekedjan, från idéstadie och konstruktion till avancerad bearbetning, montering och testning. Kort sagt - Vi minskar dina kostnader och ökar ditt värde
    Vår kund befinner sig i en tillväxtfas och som ett led i utvecklingen framåt behöver dom  nu tillsätta fler tjänster. Vi söker maskinmontör för kunds räkning, du kommer bli anställd av UFAB. 
    Arbetsbeskrivning maskinmontör  Du kommer att bygga och montera nya avancerande maskinsystem. Du ska självständigt och med stor noggrannhet montera och kvalitetssäkra maskinsystem utifrån ett underlag av ritningar & instruktioner.
    Din bakgrund Du har en 3-årig gymnasial utbildning med teknisk/praktisk inriktning. Erfarenhet av montering och/eller praktiskt handlag är en tillgång för den sökande. Du har tidigare erfarenheter av liknande arbetsuppgifter. 
    EgenskaperVi söker dig som är självgående, teknisktkunnig, engagerad, driven och initiativrik. Du gillar att arbeta i ett högt tempo och gillar nya utmaningar. Du kan planera ditt eget arbete, vara flexibel när det behövs.  Goda kunskaper i Engelska och Svenska.
    Goda kunskaper i ritningsläsning
    Goda datakunskaper   Mekanik & pneumatikkunskap Meriterande om du även har kunskap inom mätning med mätarm och laserTracker. Tillsvidareanställning och urval sker löpande. 
        Om Bahusia
    Bahusia är den externa personalavdelningen för små och medelstora företag. Vi skapar lönsamhet genom HR- och arbetsgivarstöd, rekrytering och personaluthyrning. Vår verksamhet är framförallt inriktad mot Bohuslän, Trestad och Göteborg. Oavsett om du söker din nästa utmaning och vill ta nästa steg i din karriär, eller vill jobba och studera samtidigt så har Bahusia en lösning för dig. 
    Vill du arbeta på ett av Västsveriges snabbast växande konsultbolag?`,
    parsedData: {
        requirements: ["Teknisk/praktisk gymnasieutbildning", "Erfarenhet av montering", "Goda kunskaper i Engelska och Svenska", "Goda kunskaper i ritningsläsning", "Goda datakunskaper", "Mekanik & pneumatikkunskap"],
        niceToHave: ["Kunskap inom mätning med mätarm och laserTracker"],
        keywords: ["maskinmontör", "montering", "ritningar", "teknisk", "självgående", "engagerad", "driven", "mekanik", "pneumatik"],
        responsibilities: ["Bygga och montera maskinsystem", "Kvalitetssäkra maskinsystem", "Planera eget arbete"],
        dismissedRequirements: []
    }
};

export function TestFlowPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const runTest = async () => {
            console.log("Normalizing CV...");
            const normalized = normalizeCv(rawCvText);

            // 1. Save Master CV
            // @ts-ignore
            await db.profile.put({
                id: "me",
                masterCvJson: normalized.normalizedCv,
                updatedAt: new Date().toISOString()
            });

            // 2. Save Job Match
            const jobId = crypto.randomUUID();
            // @ts-ignore
            await db.jobs.add({
                id: jobId,
                title: jobData.title,
                company: jobData.company,
                sourceUrl: "https://arbetsformedlingen.se/platsbanken/annonser/30651437",
                createdAt: new Date().toISOString(),
                extractedText: jobData.originalText,
                dismissedRequirements: []
            });

            // 3. Navigate to Match View
            navigate(`/match/${jobId}`);
        };

        runTest();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <h1 className="text-2xl font-bold">Laddar testdata...</h1>
            <p className="text-muted-foreground animate-pulse">Importerar CV och jobbannons och skickar dig till matchningen.</p>
        </div>
    );
}
