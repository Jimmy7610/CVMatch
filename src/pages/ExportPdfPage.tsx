import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { versionService } from "../features/versions/versionService";
import { CvPrintTemplate } from "../features/export/CvPrintTemplate";
import type { Version } from "../types";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";

export default function ExportPdfPage() {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const [version, setVersion] = useState<Version | null>(null);

    useEffect(() => {
        if (!jobId) return;
        async function load() {
            const v = await versionService.getByJobId(jobId!);
            if (!v) {
                navigate(`/match/${jobId}`);
                return;
            }
            setVersion(v);
        }
        load();
    }, [jobId, navigate]);

    if (!version) return <div className="p-8 text-center print:hidden">Laddar utskrift...</div>;

    return (
        <div className="min-h-screen bg-muted/20">

            {/* Print Controls (Hidden when printing) */}
            <div className="sticky top-0 z-10 bg-background border-b shadow-sm p-4 print:hidden flex justify-between items-center max-w-5xl mx-auto">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka
                </Button>
                <div className="flex gap-4 items-center">
                    <p className="text-sm text-muted-foreground mr-4">Ställ in marginaler på "Inga" och välj "Spara som PDF" i utskriftsdialogen.</p>
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Exportera till PDF / Skriv ut
                    </Button>
                </div>
            </div>

            {/* The Actual A4 / Print Area */}
            <div className="py-8 print:py-0 print:bg-white bg-transparent flex justify-center">
                <div className="bg-white shadow-lg print:shadow-none w-full max-w-[210mm] min-h-[297mm] print:w-auto print:max-w-none print:min-h-0">
                    <CvPrintTemplate cv={version.tailoredCvJson} />
                </div>
            </div>

        </div>
    );
}
