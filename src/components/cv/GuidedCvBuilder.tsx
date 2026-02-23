import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMasterCv } from "../../hooks/useMasterCv";
import { parseCvFromText } from "../../lib/cv/parseFromText";
import { useToast } from "@/hooks/use-toast";

export function GuidedCvBuilder({ onDone }: { onDone: () => void }) {
    const [pasteText, setPasteText] = useState("");
    const { updateCv } = useMasterCv();
    const { toast } = useToast();

    const handleParse = () => {
        if (!pasteText.trim()) return;
        const structured = parseCvFromText(pasteText);
        updateCv(structured, true);
        toast({ title: "Importerat!", description: "Gå igenom och rätta eventuella fel." });
        onDone();
    };

    const handleManualStart = () => {
        updateCv({ profile: "Startade manuellt CV..." }, true); // Just to kick it out of empty state
        onDone();
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Snabbstart: Klistra in text</CardTitle>
                    <CardDescription>
                        Klistra in text från ditt befintliga CV (LinkedIn, Word, PDF-text) så försöker vi strukturera det.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Klistra in din text här..."
                        className="min-h-[200px]"
                        value={pasteText}
                        onChange={e => setPasteText(e.target.value)}
                    />
                    <Button onClick={handleParse} disabled={!pasteText.trim()}>Strukturera CV</Button>
                </CardContent>
            </Card>

            <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-border flex-1" />
                <span className="text-muted-foreground text-sm uppercase">eller</span>
                <div className="h-px bg-border flex-1" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bygg från grunden</CardTitle>
                    <CardDescription>
                        Skapa ditt CV manuellt via strukturerade fält.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" onClick={handleManualStart}>Starta Byggaren</Button>
                </CardContent>
            </Card>
        </div>
    );
}
