import type { MasterCV } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MatchPreview({ master, tailored }: { master: MasterCV, tailored: MasterCV }) {
    return (
        <Card className="border-muted bg-muted/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    Förhandsgranskning: Master vs Anpassat
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Original (Master)</h4>
                    <div className="space-y-3 opacity-60">
                        {master.experiences.slice(0, 3).map((exp, i) => (
                            <div key={i} className="text-[11px] border-l-2 border-muted pl-2 py-1">
                                <div className="font-bold">{exp.role}</div>
                                <div className="text-muted-foreground line-clamp-1">{exp.company}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">Anpassat (Tailored)</h4>
                    <div className="space-y-3">
                        {tailored.experiences.slice(0, 3).map((exp, i) => (
                            <div key={i} className="text-[11px] border-l-2 border-primary pl-2 py-1 bg-primary/5">
                                <div className="font-bold flex justify-between items-center">
                                    {exp.role}
                                    {i === 0 && <Badge variant="outline" className="text-[8px] h-3 px-1 border-primary/30 text-primary">PRIORITERAD</Badge>}
                                </div>
                                <div className="text-primary/70 line-clamp-1">{exp.company}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardContent className="pt-0 pb-4">
                <p className="text-[10px] text-muted-foreground italic">Visar de 3 viktigaste erfarenheterna. Klicka på "Visa PDF" för att se hela resultatet.</p>
            </CardContent>
        </Card>
    );
}
