import { RewriteSettingsPanel } from "../features/rewrite/components/RewriteSettingsPanel";
import { Button } from "@/components/ui/button";

export default function MatchPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Anpassa CV</h1>
                <p className="text-muted-foreground">Välj hur du vill generera ditt skräddarsydda CV.</p>
            </div>

            <RewriteSettingsPanel />

            <div className="border border-dashed rounded-lg p-10 flex flex-col items-center justify-center space-y-4">
                <p className="text-muted-foreground">Matchningen saknar fortfarande jobb-data i MVP:n. (Steg 5/7 återstår)</p>
                <Button>Skapa anpassat CV</Button>
            </div>
        </div>
    );
}
