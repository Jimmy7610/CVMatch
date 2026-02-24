import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../features/jobs/jobService";
import type { Job } from "../types";
import { useOcr } from "../features/ocr/useOcr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Bot, Link2, ExternalLink } from "lucide-react";

export default function JobDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [job, setJob] = useState<Job | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { extractText, progress, isProcessing, error } = useOcr();
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);
    const [showCorsAlert, setShowCorsAlert] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!id) return;
        async function load() {
            const data = await jobService.getById(id!);
            if (!data) {
                navigate("/jobs");
                return;
            }
            setJob(data);
        }
        load();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [id, navigate]);

    const updateJob = useCallback((updates: Partial<Job>) => {
        if (!job) return;
        setJob(prev => ({ ...prev!, ...updates }));

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            jobService.update(job.id, updates).then(() => {
                // Auto-saving silently is nice, could use a subtle indicator instead of toast
            });
        }, 1000);
    }, [job]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // We store the image preview transiently for the OCR step in MVP.
        const url = URL.createObjectURL(file);
        setImagePreview(url);
    };

    const handleRunOcr = async () => {
        if (!imagePreview) return;

        const text = await extractText(imagePreview);
        if (text) {
            updateJob({ extractedText: text });
            toast({ title: "Text extraherad!", description: "Gå igenom och rätta eventuella fel." });
        }
        if (error) {
            toast({ title: "Fel vid OCR", description: error, variant: "destructive" });
        }
    };

    const handleFetchUrl = async () => {
        if (!job || !job.sourceUrl) return;

        setIsFetchingUrl(true);
        try {
            const response = await fetch(job.sourceUrl);
            const html = await response.text();

            // Basic DOM parsing to extract text
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Remove noise
            doc.querySelectorAll('script, style, nav, footer, header, svg, noscript').forEach(el => el.remove());

            // Target common content areas or just take body text
            const text = doc.body.innerText || doc.body.textContent || "";
            const cleanText = text.replace(/\s+/g, ' ').trim();

            if (cleanText.length < 100) {
                throw new Error("Kunde inte hitta tillräckligt med text på sidan.");
            }

            updateJob({ extractedText: cleanText });
            toast({
                title: "Text hämtad!",
                description: `${cleanText.length} tecken extraherade från länken.`
            });
        } catch (err) {
            toast({
                title: "Hämtning misslyckades",
                description: "Webbplatsen blockerar troligen hämtning (CORS). Öppna annonsen, markera texten och kopiera in den här.",
                variant: "destructive",
                duration: 5000
            });
            // Show a specific alert or message in the UI too
            setShowCorsAlert(true);
        } finally {
            setIsFetchingUrl(false);
        }
    };

    if (!job) return <div className="p-8 text-center text-muted-foreground">Laddar...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Jobbdetaljer</h1>
                    <p className="text-muted-foreground">Klistra in annonsen eller ladda upp en skärmdump.</p>
                </div>
                {job && (
                    <Button onClick={() => navigate(`/match/${job.id}`)}>
                        <Bot className="mr-2 h-4 w-4" /> Matcha CV
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Grundinfo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Titel</Label>
                                <Input
                                    value={job.title}
                                    onChange={e => updateJob({ title: e.target.value })}
                                    placeholder="t.ex. Frontend-utvecklare"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Företag</Label>
                                <Input
                                    value={job.company}
                                    onChange={e => updateJob({ company: e.target.value })}
                                    placeholder="t.ex. TechCorp AB"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Link2 className="h-4 w-4" /> Jobblänk (URL)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={job.sourceUrl || ""}
                                        onChange={e => updateJob({ sourceUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleFetchUrl}
                                        disabled={!job.sourceUrl || isFetchingUrl}
                                    >
                                        {isFetchingUrl ? "Hämtar..." : "Hämta text"}
                                    </Button>
                                </div>
                                {showCorsAlert && (
                                    <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-medium space-y-2">
                                        <p>Webbplatsen blockerar automatisk hämtning (CORS).</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs gap-1"
                                            onClick={() => window.open(job.sourceUrl, '_blank')}
                                        >
                                            Öppna länken i ny flik <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Annonsbild (Valfritt)</CardTitle>
                            <CardDescription>Ladda upp en skärmdump för att använda OCR.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Label htmlFor="picture" className="cursor-pointer">
                                    <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors font-medium">
                                        <Upload className="h-4 w-4" /> Välj bild
                                    </div>
                                    <input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </Label>
                                {imagePreview && (
                                    <Button variant="outline" onClick={handleRunOcr} disabled={isProcessing}>
                                        {isProcessing ? `Bearbetar (${progress}%)` : "Kör OCR"}
                                    </Button>
                                )}
                            </div>

                            {imagePreview && (
                                <div className="mt-4 rounded-md overflow-hidden border">
                                    <img src={imagePreview} alt="Förhandsgranskning" className="w-full object-contain max-h-[300px] bg-muted/50" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                Annonstext
                            </CardTitle>
                            <CardDescription>
                                Här samlas texten från annonsen. Du kan alltid redigera den manuellt.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <Textarea
                                className="flex-1 min-h-[400px] font-mono text-sm resize-y"
                                value={job.extractedText}
                                onChange={e => updateJob({ extractedText: e.target.value })}
                                placeholder="Klistra in annonstexten här, eller ladda upp en bild...&#10;&#10;Krav:&#10;- React&#10;- TypeScript&#10;- Minst 3 års erfarenhet"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
