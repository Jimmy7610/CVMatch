import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Activity } from "lucide-react";
import type { ReconstructResult } from "../../lib/reconstructCv";
import type { MasterCV } from "../../types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    originalCv: MasterCV;
    result: ReconstructResult | null;
    onApply: (newCv: MasterCV, approvedSkills: string[]) => void;
}

export function StructurePreviewModal({ open, onOpenChange, originalCv, result, onApply }: Props) {
    const [view, setView] = useState<"before" | "after">("after");
    const [approvedSkills, setApprovedSkills] = useState<string[]>([]);

    if (!result) return null;

    const currentCv = view === "before" ? originalCv : result.normalizedMasterCvJson;

    const toggleSkill = (skill: string) => {
        setApprovedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        CV Omstrukturering
                    </DialogTitle>
                    <DialogDescription>
                        Vi har analyserat din CV-text och hittat en bättre struktur. Granska nedan innan du tillämpar ändringarna.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden">
                    {/* Left sidebar: Change Summary */}
                    <div className="md:col-span-1 space-y-6 overflow-y-auto pr-2">
                        <div className="bg-muted/30 p-4 rounded-lg border text-sm space-y-3">
                            <h3 className="font-bold flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" /> Sammanfattning
                            </h3>
                            <ul className="space-y-2">
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Extraherade Erfarenheter:</span>
                                    <span className="font-mono font-bold text-primary">+{result.changeLog.experiencesSplit}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Strukturerade Punkter:</span>
                                    <span className="font-mono font-bold text-primary">+{result.changeLog.bulletsCreated}</span>
                                </li>
                            </ul>
                        </div>

                        {result.changeLog.suggestedSkills.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-bold text-sm">Föreslagna Kompetenser</h3>
                                <p className="text-xs text-muted-foreground">
                                    Vi hittade dessa kompetenser i din text. Markera de du vill lägga till i din profil.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {result.changeLog.suggestedSkills.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => toggleSkill(s)}
                                            className={`text-xs px-2 py-1 rounded-full border transition-colors ${approvedSkills.includes(s)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'bg-background text-muted-foreground hover:border-primary/50'
                                                }`}
                                        >
                                            {s} {approvedSkills.includes(s) && "✓"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side: Preview */}
                    <div className="md:col-span-2 flex flex-col h-full border rounded-lg overflow-hidden relative">
                        {/* Tab toggle */}
                        <div className="absolute top-2 right-2 flex bg-background/80 backdrop-blur border rounded-md p-1 shadow-sm z-10">
                            <button
                                onClick={() => setView("before")}
                                className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${view === "before" ? 'bg-muted font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}
                            >
                                Före
                            </button>
                            <button
                                onClick={() => setView("after")}
                                className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${view === "after" ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}
                            >
                                Efter
                            </button>
                        </div>

                        <div className="bg-muted/10 p-2 text-center text-xs text-muted-foreground uppercase tracking-wider font-bold border-b">
                            Förhandsgranskning
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white dark:bg-zinc-950">
                            {currentCv.profile && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Profil</h4>
                                    <p className="text-sm">{currentCv.profile}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">Erfarenheter ({currentCv.experiences.length})</h4>
                                <div className="space-y-4">
                                    {currentCv.experiences.map((exp, i) => (
                                        <div key={i} className={`pl-3 border-l-2 ${view === 'after' ? 'border-primary/50' : 'border-muted'}`}>
                                            <div className="font-bold text-sm">{exp.role}</div>
                                            <div className="text-xs text-muted-foreground mb-1">{exp.company} {exp.period ? `| ${exp.period}` : ''}</div>
                                            {exp.description && <p className="text-xs mb-2 opacity-80">{exp.description}</p>}
                                            {exp.bullets.length > 0 && (
                                                <ul className="list-disc list-inside text-xs opacity-90 space-y-1">
                                                    {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {currentCv.skills.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Befintliga Kompetenser ({currentCv.skills.length})</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {currentCv.skills.map(s => (
                                            <span key={s} className="bg-muted px-2 py-0.5 rounded text-[10px] text-muted-foreground">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-4 border-t pt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Avbryt</Button>
                    <Button onClick={() => onApply(result.normalizedMasterCvJson, approvedSkills)} className="gap-2">
                        Tillämpa struktur <ArrowRight className="h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
