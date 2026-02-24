import { useState } from "react";
import { useMasterCv } from "../hooks/useMasterCv";
import { MasterCvEditor } from "../components/cv/MasterCvEditor";
import { CvImport } from "../components/cv/CvImport";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { StructurePreviewModal } from "../components/cv/StructurePreviewModal";
import { reconstructCv, type ReconstructResult } from "../lib/reconstructCv";

export default function MasterCvPage() {
    const { profile, loading, saveStatus, updateCv } = useMasterCv();

    if (loading) return <div>Laddar...</div>;

    const experiencesCount = profile?.masterCvJson.experiences?.length || 0;
    const bulletsCount = profile?.masterCvJson.experiences?.reduce((acc, exp) => acc + (exp.bullets?.length || 0), 0) || 0;
    const skillsCount = profile?.masterCvJson.skills?.length || 0;
    const charCount = profile?.masterCvJson.rawCvText?.length || 0;

    const [strukturModalOpen, setStrukturModalOpen] = useState(false);
    const [reconstructResult, setReconstructResult] = useState<ReconstructResult | null>(null);

    const isHealthy = experiencesCount >= 2 && bulletsCount >= 6 && skillsCount >= 5;

    const handleOpenStruktur = () => {
        if (!profile?.masterCvJson) return;
        setReconstructResult(reconstructCv(profile.masterCvJson));
        setStrukturModalOpen(true);
    };

    const handleApplyStruktur = (newCv: any, approvedSkills: string[]) => {
        updateCv({ ...newCv, skills: [...newCv.skills, ...approvedSkills] }, true);
        setStrukturModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Mitt CV (Master)</h1>
                    <p className="text-muted-foreground">Hantera ditt grund-CV som används för matchning.</p>
                    <div className="flex gap-4 mt-2">
                        <div className="text-xs">
                            <span className="text-muted-foreground">Importerad text: </span>
                            <span className="font-mono font-bold">{charCount}</span>
                        </div>
                        <div className="text-xs">
                            <span className="text-muted-foreground">Erfarenheter: </span>
                            <span className="font-mono font-bold">{experiencesCount}</span>
                        </div>
                        <div className="text-xs">
                            <span className="text-muted-foreground">Kompetenser: </span>
                            <span className={`font-mono font-bold ${skillsCount === 0 ? 'text-yellow-600' : ''}`}>{skillsCount}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <SaveStatusIndicator status={saveStatus} />
                    <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        disabled={charCount < 50}
                        onClick={handleOpenStruktur}
                    >
                        <Wand2 className="h-4 w-4" />
                        Strukturera om CV
                    </Button>
                </div>
            </div>

            {!isHealthy && charCount > 50 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md text-sm space-y-1">
                    <p className="font-bold">⚠️ Ditt CV behöver struktureras bättre</p>
                    <p className="text-xs">
                        För att matchningen ska bli riktigt bra behöver vi fler detaljer.
                        Just nu har du: <span className="font-bold">{experiencesCount}</span> erfarenheter,
                        <span className="font-bold">{bulletsCount}</span> punkter och
                        <span className="font-bold">{skillsCount}</span> kompetenser.
                    </p>
                    <p className="text-xs italic">Tips: Dela upp din text i tydliga arbetsplatser och lägg till konkreta punkter för vad du gjort.</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <CvImport onImport={(normalizedCv) => {
                    updateCv(normalizedCv, true);
                    setTimeout(() => {
                        document.getElementById('editor-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }} />

                <div id="editor-section" className="space-y-4 pt-6 mt-4 border-t-2 border-dashed">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Granska och justera</h2>
                        <p className="text-muted-foreground">
                            Gå igenom den extraherade informationen nedan. Rätta eventuella fel och fyll i saknade detaljer för att skapa ett perfekt Master CV.
                        </p>
                    </div>
                    <MasterCvEditor />
                </div>
            </div>

            {profile && (
                <StructurePreviewModal
                    open={strukturModalOpen}
                    onOpenChange={setStrukturModalOpen}
                    originalCv={profile.masterCvJson}
                    result={reconstructResult}
                    onApply={handleApplyStruktur}
                />
            )}
        </div>
    );
}

function SaveStatusIndicator({ status }: { status: "idle" | "saving" | "saved" | "error" | "validation_error" }) {
    if (status === "idle") return <div className="text-xs text-muted-foreground mr-4">Ändringar upptäckta...</div>;
    if (status === "saving") return <div className="text-xs text-blue-500 animate-pulse font-medium mr-4">Sparar...</div>;
    if (status === "saved") return <div className="text-xs text-green-600 font-medium flex items-center gap-1 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        Sparad
    </div>;
    if (status === "error") return <div className="text-xs text-destructive font-medium mr-4">Fel vid sparning</div>;
    if (status === "validation_error") return <div className="text-xs text-destructive font-medium mr-4">CV kunde inte sparas – ingen giltig data hittades.</div>;
    return null;
}
