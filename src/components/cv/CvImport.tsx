import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileUp, FileText, ClipboardList, Loader2, CheckCircle2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth";

import { normalizeCv, type NormalizerResult } from "@/lib/cvNormalizer";
import type { MasterCV } from "@/types";

interface CvImportProps {
    onImport: (normalized: MasterCV) => void;
}

export function CvImport({ onImport }: CvImportProps) {
    const { toast } = useToast();
    const [pastedText, setPastedText] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);
    const [normResult, setNormResult] = useState<NormalizerResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePdfExtraction = async (file: File) => {
        setIsExtracting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                fullText += pageText + "\n";
            }

            const cleanText = fullText.trim();
            if (cleanText.length < 50) throw new Error("Kunde inte extrahera tillräckligt med text från PDF:en.");

            const normalized = normalizeCv(cleanText);
            setNormResult(normalized);
            setPastedText(cleanText);
            toast({ title: "PDF Inläst", description: `${cleanText.length} tecken extraherade.` });
        } catch (error: any) {
            console.error("PDF extraction failed:", error);
            toast({
                title: "Extrahering misslyckades",
                description: error.message || "Kunde inte läsa PDF-filen.",
                variant: "destructive"
            });
        } finally {
            setIsExtracting(false);
        }
    };

    const handleDocxExtraction = async (file: File) => {
        setIsExtracting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            const cleanText = result.value.trim();

            if (cleanText.length < 50) throw new Error("Kunde inte extrahera tillräckligt med text från DOCX-filen.");

            const normalized = normalizeCv(cleanText);
            setNormResult(normalized);
            setPastedText(cleanText);
            toast({ title: "DOCX Inläst", description: `${cleanText.length} tecken extraherade.` });
        } catch (error: any) {
            console.error("DOCX extraction failed:", error);
            toast({
                title: "Extrahering misslyckades",
                description: error.message || "Kunde inte läsa DOCX-filen.",
                variant: "destructive"
            });
        } finally {
            setIsExtracting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === "application/pdf") {
            handlePdfExtraction(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            handleDocxExtraction(file);
        } else {
            toast({ title: "Ogiltigt format", description: "Vänligen ladda upp en PDF eller DOCX.", variant: "destructive" });
        }

        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleConfirmImport = () => {
        if (!normResult) {
            if (pastedText.length < 50) {
                toast({ title: "För lite text", description: "Vänligen klistra in eller ladda upp mer text (minst 50 tecken).", variant: "destructive" });
                return;
            }
            onImport(normalizeCv(pastedText).normalizedCv);
        } else {
            onImport(normResult.normalizedCv);
        }
        toast({ title: "CV Importerat", description: "Ditt CV har strukturerats och sparats." });
    };

    return (
        <Card className="border-dashed border-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-primary" />
                    Importera befintligt CV
                </CardTitle>
                <CardDescription>
                    Ladda upp PDF/DOCX eller klistra in text för att snabbt fylla i ditt Master CV.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        className="h-20 flex flex-col gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isExtracting}
                    >
                        {isExtracting ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                        <span>Ladda upp PDF/DOCX</span>
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                    />

                    <div className="h-20 p-3 border rounded-md bg-muted/30 flex flex-col justify-center items-center gap-1 text-center">
                        <ClipboardList className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium">Eller klistra in direkt nedan</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Textarea
                        placeholder="Klistra in din CV-text här..."
                        className="min-h-[150px] text-sm"
                        value={pastedText}
                        onChange={(e) => {
                            setPastedText(e.target.value);
                            setNormResult(null);
                        }}
                        onBlur={() => {
                            if (pastedText.length >= 50 && !normResult) {
                                setNormResult(normalizeCv(pastedText));
                            }
                        }}
                    />
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            {pastedText.length} tecken
                        </span>
                    </div>
                </div>

                {normResult && (
                    <div className="p-4 border rounded-md bg-green-50/50 border-green-100">
                        <h3 className="font-bold flex items-center gap-2 mb-2 text-green-800">
                            <CheckCircle2 className="h-5 w-5" />
                            Vi tolkade ditt CV
                        </h3>
                        <p className="text-sm text-green-700/80 mb-4">
                            Här är en sammanfattning av vad vi hittade. Du kan granska och justera alla detaljer i nästa steg innan du sparar.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm bg-white p-3 rounded border border-green-100 shadow-sm">
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">Erfarenheter</span>
                                <span className="font-bold">{normResult.stats.experiences} st</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">Kompetenser</span>
                                <span className="font-bold">
                                    {normResult.stats.skills > 0 ? (
                                        <span>
                                            {normResult.stats.skills} st
                                            <span className="text-xs font-normal text-muted-foreground ml-1">
                                                ({normResult.normalizedCv.skills.slice(0, 3).join(", ")}...)
                                            </span>
                                        </span>
                                    ) : (
                                        "Inga hittades"
                                    )}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground block text-xs uppercase tracking-wider">Personlig profil</span>
                                <span className="font-medium text-xs line-clamp-2">
                                    {normResult.normalizedCv.profile ? `✅ ${normResult.normalizedCv.profile.substring(0, 100)}...` : "❌ Hittades ej"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConfirmImport}
                    disabled={pastedText.length < 50 || isExtracting}
                >
                    Spara & Granska nedan →
                </Button>
            </CardContent>
        </Card>
    );
}
