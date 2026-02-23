import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobService } from "../features/jobs/jobService";
import type { Job } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function JobsListPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const data = await jobService.getAll();
            setJobs(data);
        }
        load();
    }, []);

    const handleCreateNew = async () => {
        const id = await jobService.create("Nytt Jobb");
        navigate(`/jobs/${id}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Sparade Jobb</h1>
                    <p className="text-muted-foreground">Hantera jobb, ladda upp screenshots och gör OCR.</p>
                </div>
                <Button onClick={handleCreateNew}>
                    <Plus className="mr-2 h-4 w-4" /> Nytt jobb
                </Button>
            </div>

            {jobs.length === 0 ? (
                <Card className="border-dashed text-center p-12">
                    <CardContent className="space-y-4">
                        <h3 className="text-lg font-medium">Skapa ditt första jobb</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            Ladda upp en skärmdump på en jobbannons och använd vår inbyggda textigenkänning (OCR).
                        </p>
                        <Button onClick={handleCreateNew}>Kom igång</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {jobs.map(job => (
                        <Card key={job.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                            <CardHeader>
                                <CardTitle className="line-clamp-1">{job.title || "Namnlöst jobb"}</CardTitle>
                                <CardDescription className="line-clamp-1">{job.company || "Okänt företag"}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center text-sm text-muted-foreground">
                                <span>Uppdaterad: {new Date(job.updatedAt).toLocaleDateString("sv-SE")}</span>
                                <Link to={`/match/${job.id}`} onClick={e => e.stopPropagation()} className="text-primary hover:underline">
                                    Matcha
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
