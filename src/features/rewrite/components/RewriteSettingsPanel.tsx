import { useState } from "react";
import { useAppSettings } from "../../../lib/store";
import { getRewriteProvider } from "../providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function RewriteSettingsPanel() {
    const { settings, updateSettings, loading } = useAppSettings();
    const [testing, setTesting] = useState(false);
    const { toast } = useToast();

    if (loading) return <div>Laddar...</div>;

    const handleTestConnection = async () => {
        setTesting(true);
        const provider = getRewriteProvider("ollama");
        if (provider.testConnection) {
            const ok = await provider.testConnection({ endpoint: settings.ollamaEndpoint });
            if (ok) {
                toast({ title: "Ansluten!", description: "Ollama svarar på angiven endpoint." });
            } else {
                toast({
                    title: "Kunde inte ansluta",
                    description: "Ollama är inte nåbar. Faller tillbaka till Standard.",
                    variant: "destructive"
                });
            }
        }
        setTesting(false);
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>CV Anpassning</CardTitle>
                <CardDescription>Välj hur ditt CV ska anpassas efter jobbet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Metod</Label>
                    <Select
                        value={settings.rewriteMode}
                        onValueChange={(val: "rule" | "ollama") => updateSettings({ rewriteMode: val })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rule">Standard (regelbaserat)</SelectItem>
                            <SelectItem value="ollama">Ollama (AI, lokalt)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {settings.rewriteMode === "ollama" && (
                    <div className="space-y-4 pt-2 border-t mt-4">
                        <div className="space-y-2">
                            <Label>Ollama Endpoint</Label>
                            <Input
                                value={settings.ollamaEndpoint}
                                onChange={e => updateSettings({ ollamaEndpoint: e.target.value })}
                                placeholder="http://localhost:11434"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Modellnamn</Label>
                            <Input
                                value={settings.ollamaModel}
                                onChange={e => updateSettings({ ollamaModel: e.target.value })}
                                placeholder="qwen2.5:7b"
                            />
                        </div>
                        <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                            {testing ? "Testar..." : "Testa anslutning"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
