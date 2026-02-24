import { useMemo } from 'react';
import type { MasterCV, Job } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";

interface CvCoachPanelProps {
    masterCv: MasterCV;
    tailoredCv: MasterCV | null;
    job: Job;
}

export function CvCoachPanel({ masterCv, job }: Omit<CvCoachPanelProps, 'tailoredCv'>) {
    // Determine strengths, improvements, and quick wins based on heuristics
    const feedback = useMemo(() => {
        const strengths: string[] = [];
        const improvements: string[] = [];
        const quickWins: string[] = [];

        // --- 1. Structure Checks ---
        if (!masterCv.profile || masterCv.profile.length < 50) {
            improvements.push("Du saknar en tydlig inledande profiltext/målsättning.");
        } else {
            strengths.push("Bra inledande profiltext som presenterar dig.");
        }

        if (masterCv.skills.length === 0) {
            improvements.push("Du har ingen separat lista med kompetenser/verktyg.");
        } else if (masterCv.skills.length > 15) {
            improvements.push("Din kompetenslista är väldigt lång, försök att hålla dig till de viktigaste för rollen.");
        } else {
            strengths.push(`Tydlig kompetenslista med ${masterCv.skills.length} listade färdigheter.`);
        }

        // --- 2. Experience Checks ---
        const expsWithoutBullets = masterCv.experiences.filter(exp => exp.bullets.length === 0);
        if (expsWithoutBullets.length > 0) {
            improvements.push(`${expsWithoutBullets.length} av dina erfarenheter saknar övergripande beskrivning eller punktlistor över vad du gjorde.`);
        }

        const veryLongBullets = masterCv.experiences.flatMap(exp => exp.bullets.filter(b => b.length > 180));
        if (veryLongBullets.length > 0) {
            improvements.push(`Du har ${veryLongBullets.length} punkt(er) i dina erfarenheter som är väldigt långa. Försök hålla punkterna korta och snärtiga.`);
        }

        if (masterCv.experiences.length >= 3 && expsWithoutBullets.length === 0 && veryLongBullets.length === 0) {
            strengths.push("Dina anställningar är tydligt beskrivna med bra längd på punktlistorna.");
        }

        // --- 3. Relevance Checks (Job vs Master CV) ---
        if (job.extractedText) {
            const rawTokens = job.extractedText
                .toLowerCase()
                .split(/[^a-zåäö0-9]+/i)
                .filter(t => t.length > 3);

            // Just picking a few requirements as examples to see if they exist in the CV
            const sampleReqs = Array.from(new Set(rawTokens)).filter(t => !["och", "att", "som", "det", "för", "till", "med", "är", "vi", "på", "en", "ett", "den"].includes(t)).slice(0, 5);
            const missingReqs = sampleReqs.filter(req => {
                const reqLower = req.toLowerCase();
                const cvText = masterCv.rawCvText?.toLowerCase() || "";
                return !cvText.includes(reqLower);
            });

            if (missingReqs.length > 0) {
                quickWins.push(`Annonsen verkar prata mycket om '${missingReqs[0]}'. Om du har den kompetensen, se till att skriva ut det tydligt under 'Kompetenser'.`);
            } else {
                strengths.push("Ditt CV innehåller många av de centrala sökorden från annonsen.");
            }
        }

        // --- 4. Basic Info Checks ---
        // A simple heuristic checking if standard contact info might be missing based on length of raw text
        if (masterCv.rawCvText && !masterCv.rawCvText.includes("@") && !masterCv.rawCvText.match(/07[0-9]/)) {
            improvements.push("Ditt CV verkar sakna e-postadress eller svenskt mobilnummer.");
        }

        // Ensure we have at least one of each if possible, or fallback defaults
        if (quickWins.length === 0) {
            quickWins.push("Dubbelkolla alltid så att datumformatet på dina anställningar är konsekvent.");
        }

        return { strengths, improvements, quickWins };
    }, [masterCv, job]);

    return (
        <Card className="shadow-sm border-indigo-100 bg-white">
            <CardHeader className="bg-indigo-50/50 pb-4">
                <CardTitle className="text-xl text-indigo-900 flex items-center">
                    <span>CV Coach</span>
                </CardTitle>
                <CardDescription>
                    Automatisk granskning av ditt Master CV baserat på rekryterares bästa praxis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div>
                    <h3 className="flex items-center text-sm font-semibold text-emerald-800 mb-3">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Styrkor i ditt Master CV
                    </h3>
                    <ul className="space-y-2">
                        {feedback.strengths.map((str, idx) => (
                            <li key={idx} className="text-sm text-gray-700 bg-emerald-50/50 p-2 rounded border border-emerald-100/50">
                                {str}
                            </li>
                        ))}
                    </ul>
                </div>

                {feedback.improvements.length > 0 && (
                    <div>
                        <h3 className="flex items-center text-sm font-semibold text-amber-800 mb-3">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Att förbättra
                        </h3>
                        <ul className="space-y-2">
                            {feedback.improvements.map((imp, idx) => (
                                <li key={idx} className="text-sm text-gray-700 bg-amber-50/50 p-2 rounded border border-amber-100/50">
                                    {imp}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <h3 className="flex items-center text-sm font-semibold text-blue-800 mb-3">
                        <Zap className="w-4 h-4 mr-2" />
                        Snabba vinster för just detta jobb
                    </h3>
                    <ul className="space-y-2">
                        {feedback.quickWins.map((win, idx) => (
                            <li key={idx} className="text-sm text-gray-700 bg-blue-50/50 p-2 rounded border border-blue-100/50">
                                {win}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}

