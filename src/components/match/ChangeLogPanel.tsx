import type { ChangeLog } from "../../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

export function ChangeLogPanel({ changeLog }: { changeLog: ChangeLog }) {
    if (!changeLog) return null;

    const hasChanges = changeLog.movedSections?.length > 0 ||
        changeLog.promotedExperiences?.length > 0 ||
        changeLog.rephrasedBullets?.length > 0 ||
        changeLog.removedToOther?.length > 0;

    if (!hasChanges) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Ändringslogg</CardTitle>
                    <CardDescription>Inga ändringar gjordes jämfört med ditt Master CV.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Anpassningar</CardTitle>
                <CardDescription>Detta ändrades för att matcha jobbet bättre.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                {changeLog.promotedExperiences && changeLog.promotedExperiences.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> Framhävda erfarenheter
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            {changeLog.promotedExperiences.map((exp: string, i: number) => <li key={i}>{exp}</li>)}
                        </ul>
                    </div>
                )}

                {changeLog.movedSections && changeLog.movedSections.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-500" /> Omstrukturerat
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            {changeLog.movedSections.map((sec: string, i: number) => <li key={i}>{sec}</li>)}
                        </ul>
                    </div>
                )}

                {changeLog.rephrasedBullets && changeLog.rephrasedBullets.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-purple-500" /> Omformulerade punkter
                        </h4>
                        <div className="space-y-2">
                            {changeLog.rephrasedBullets.map((bullet: { before: string; after: string }, i: number) => (
                                <div key={i} className="text-sm bg-muted/50 p-2 rounded-md">
                                    <div className="line-through text-muted-foreground/70 mb-1">{bullet.before}</div>
                                    <div className="flex items-center gap-2 text-foreground">
                                        <ArrowRight className="h-3 w-3" /> {bullet.after}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
