import { useMasterCv } from "../hooks/useMasterCv";
import { GuidedCvBuilder } from "../components/cv/GuidedCvBuilder";
import { MasterCvEditor } from "../components/cv/MasterCvEditor";

export default function MasterCvPage() {
    const { profile, loading } = useMasterCv();

    if (loading) return <div>Laddar...</div>;

    const hasContent = !!profile?.masterCvJson.profile || (profile?.masterCvJson.experiences && profile.masterCvJson.experiences.length > 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Mitt CV (Master)</h1>
                    <p className="text-muted-foreground">Hantera ditt grund-CV som används för matchning.</p>
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
