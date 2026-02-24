import { useMasterCv } from "../hooks/useMasterCv";
import { GuidedCvBuilder } from "../components/cv/GuidedCvBuilder";
import { MasterCvEditor } from "../components/cv/MasterCvEditor";

export default function MasterCvPage() {
    const { profile, loading, saveStatus } = useMasterCv();

    if (loading) return <div>Laddar...</div>;

    const hasContent = !!profile?.masterCvJson.profile || (profile?.masterCvJson.experiences && profile.masterCvJson.experiences.length > 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Mitt CV (Master)</h1>
                    <p className="text-muted-foreground">Hantera ditt grund-CV som används för matchning.</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <SaveStatusIndicator status={saveStatus} />
                </div>
            </div>

            {!hasContent ? (
                <GuidedCvBuilder onDone={() => { }} />
            ) : (
                <MasterCvEditor />
            )}
        </div>
    );
}

function SaveStatusIndicator({ status }: { status: "idle" | "saving" | "saved" | "error" }) {
    if (status === "idle") return <div className="text-xs text-muted-foreground mr-4">Ändringar upptäckta...</div>;
    if (status === "saving") return <div className="text-xs text-blue-500 animate-pulse font-medium mr-4">Sparar...</div>;
    if (status === "saved") return <div className="text-xs text-green-600 font-medium flex items-center gap-1 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        Sparad
    </div>;
    if (status === "error") return <div className="text-xs text-destructive font-medium mr-4">Fel vid sparning</div>;
    return null;
}
