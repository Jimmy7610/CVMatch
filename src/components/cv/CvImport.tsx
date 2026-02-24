import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileUp, FileText, ClipboardList, Loader2, CheckCircle2 } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth";

// Initialize PDF.js worker using Vite's URL handling
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface CvImportProps {
    onImport: (text: string, source?: string) => void;
}

export function CvImport({ onImport }: CvImportProps) {
    const { toast } = useToast();
    const [pastedText, setPastedText] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);
    const [importStats, setImportStats] = useState<{ source: string, count: number } | null>(null);
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

            setImportStats({ source: `PDF (${pdf.numPages} sidor)`, count: cleanText.length });
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

            setImportStats({ source: "DOCX", count: cleanText.length });
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
        if (pastedText.length < 50) {
            toast({ title: "För lite text", description: "Vänligen klistra in eller ladda upp mer text (minst 50 tecken).", variant: "destructive" });
            return;
        }

        const source = importStats?.source || "Inskriven text";
        onImport(pastedText, source);
        toast({ title: "CV Importerat", description: "Texten har sparats som rådata till ditt Master CV." });
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
                            if (importStats) setImportStats(null);
                        }}
                    />
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                            {pastedText.length} tecken
                        </span>
                        {importStats && (
                            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {importStats.source.toUpperCase()} IDENTIFIERAD
                            </span>
                        )}
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handleConfirmImport}
                    disabled={pastedText.length < 50 || isExtracting}
                >
                    Slutför import till Master CV
                </Button>
            </CardContent>
        </Card>
    );
}
