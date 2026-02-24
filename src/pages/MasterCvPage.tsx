import { useMasterCv } from "../hooks/useMasterCv";
import { MasterCvEditor } from "../components/cv/MasterCvEditor";
import { CvImport } from "../components/cv/CvImport";

export default function MasterCvPage() {
    const { profile, loading, saveStatus, updateCv } = useMasterCv();

    if (loading) return <div>Laddar...</div>;

    const experiencesCount = profile?.masterCvJson.experiences?.length || 0;
    const skillsCount = profile?.masterCvJson.skills?.length || 0;
    const charCount = profile?.masterCvJson.rawCvText?.length || 0;

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
                <div className="flex flex-col items-end gap-1">
                    <SaveStatusIndicator status={saveStatus} />
                </div>
            </div>

            {skillsCount === 0 && charCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm">
                    Inga kompetenser hittades. Lägg till minst några för bättre matchning.
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <CvImport onImport={(text) => {
                    updateCv({ rawCvText: text }, true);
                }} />

                <MasterCvEditor />
            </div>
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
