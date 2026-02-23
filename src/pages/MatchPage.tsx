import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { jobService } from "../features/jobs/jobService";
import { versionService } from "../features/versions/versionService";
import { useMasterCv } from "../hooks/useMasterCv";
import { useRewriteSettings } from "../lib/store";
import { getRewriteProvider } from "../features/rewrite/providers";
import { RewriteSettingsPanel } from "../features/rewrite/components/RewriteSettingsPanel";
import { ChangeLogPanel } from "../components/match/ChangeLogPanel";
import { QuestionsPanel } from "../components/match/QuestionsPanel";
import type { Job, Version } from "../types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, Wand2, FileSearch } from "lucide-react";

export default function MatchPage() {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const { profile, loading: profileLoading } = useMasterCv();
    const { settings, loading: settingsLoading } = useRewriteSettings();

    const [job, setJob] = useState<Job | null>(null);
    const [version, setVersion] = useState<Version | null>(null);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (!jobId) return;
        async function load() {
            const jobData = await jobService.getById(jobId!);
            if (!jobData) {
                navigate("/jobs");
                return;
            }
            setJob(jobData);

            const versionData = await versionService.getByJobId(jobId!);
            if (versionData) {
                setVersion(versionData);
            }
        }
        load();
    }, [jobId, navigate]);

    const handleGenerate = async () => {
        if (!profile || !job) return;

        // Naive parsing of extracted text to JobParsedData for MVP
        const jobTokens = job.extractedText.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
        const parsedJobFields = {
            title: job.title,
            requirements: jobTokens, // Sending everything as requirements to match keywords
            niceToHave: [],
            responsibilities: [],
            keywords: jobTokens
        };

        setGenerating(true);
        try {
            const provider = getRewriteProvider(settings.rewriteMode);
            const result = await provider.rewrite(
                profile.masterCvJson,
                parsedJobFields,
                { endpoint: settings.ollamaEndpoint, model: settings.ollamaModel }
            );

            await versionService.create(job.id, result.tailoredCvJson, result.changeLogJson, result.questions);
            const newVersionData = await versionService.getByJobId(job.id);

            setVersion(newVersionData!);
            toast({ title: "Skapat!", description: "Ditt CV har anpassats framgångsrikt." });
        } catch (err: any) {
            console.error(err);
            toast({ title: "Ett fel uppstod", description: err.message, variant: "destructive" });
        } finally {
            setGenerating(false);
        }
    };

    if (profileLoading || settingsLoading || !job) {
        return <div className="p-8 text-center text-muted-foreground">Laddar...</div>;
    }

    const hasMasterContent = profile?.masterCvJson.experiences && profile.masterCvJson.experiences.length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Anpassa CV: {job.title}</h1>
                    <p className="text-muted-foreground">{job.company}</p>
                </div>
                {version && (
                    <Button asChild variant="default">
                        <Link to={`/export/${job.id}`}>
                            <FileText className="mr-2 h-4 w-4" /> Visa PDF
                        </Link>
                    </Button>
                )}
            </div>

            {!hasMasterContent && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center gap-2">
                    <FileSearch className="h-5 w-5" />
                    <span>Du måste lägga till info i ditt <strong>Master CV</strong> innan du kan matcha mot ett jobb.</span>
                    <Link to="/cv" className="underline ml-auto font-medium">Gå till Master CV</Link>
                </div>
            )}

            <RewriteSettingsPanel />

            <div className="flex justify-center py-4">
                <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={generating || !hasMasterContent}
                    className="w-full sm:w-auto min-w-[300px]"
                >
                    <Wand2 className="mr-2 h-5 w-5" />
                    {generating ? "Genererar..." : (version ? "Generera om" : "Skapa anpassat CV")}
                </Button>
            </div>

            {version && (
                <div className="grid gap-6 md:grid-cols-2 mt-8 animate-in fade-in slide-in-from-bottom-4">
                    <ChangeLogPanel changeLog={version.changeLogJson} />
                    <QuestionsPanel questions={version.questions} />
                </div>
            )}

            {job.extractedText && !version && (
                <div className="text-sm text-muted-foreground text-center border border-dashed rounded-lg p-8">
                    <p>Klicka på knappen ovan för att låta motorn analysera {job.extractedText.length} tecken från jobbannonsen.</p>
                </div>
            )}
        </div>
    );
}
