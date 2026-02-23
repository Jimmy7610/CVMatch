import { useMasterCv } from "../../hooks/useMasterCv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MasterCvEditor() {
    const { profile, updateCv } = useMasterCv();

    if (!profile) return null;

    const cv = profile.masterCvJson;

    const handleProfileChange = (val: string) => updateCv({ profile: val });
    const handleSkillsChange = (val: string) => updateCv({ skills: val.split(",").map(s => s.trim()).filter(Boolean) });

    return (
        <div className="space-y-8 pb-10">
            <Card>
                <CardHeader>
                    <CardTitle>Din Profil</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label className="sr-only">Sammanfattning</Label>
                    <Textarea
                        className="min-h-[150px]"
                        value={cv.profile}
                        onChange={e => handleProfileChange(e.target.value)}
                        placeholder="Skriv en kort sammanfattning om dig själv..."
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Kompetenser & Färdigheter</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label>Separera med kommatecken</Label>
                    <Textarea
                        className="min-h-[100px] mt-2"
                        value={cv.skills.join(", ")}
                        onChange={e => handleSkillsChange(e.target.value)}
                        placeholder="React, TypeScript, Agilt arbete, B-körkort..."
                    />
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Erfarenhet</h2>
                {/* Simple MVP mapping. Real form hook would be better, but this gets it done */}
                {cv.experiences.map((exp, index) => (
                    <Card key={exp.id}>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Roll</Label>
                                    <Input value={exp.role} onChange={e => {
                                        const exps = [...cv.experiences];
                                        exps[index].role = e.target.value;
                                        updateCv({ experiences: exps });
                                    }} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Företag / Organisation</Label>
                                    <Input value={exp.company} onChange={e => {
                                        const exps = [...cv.experiences];
                                        exps[index].company = e.target.value;
                                        updateCv({ experiences: exps });
                                    }} />
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground col-span-2">
                                    Period: <Input value={exp.period} placeholder="t.ex. 2020 - 2023" onChange={e => {
                                        const exps = [...cv.experiences];
                                        exps[index].period = e.target.value;
                                        updateCv({ experiences: exps });
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Allmän beskrivning</Label>
                                <Textarea value={exp.description} onChange={e => {
                                    const exps = [...cv.experiences];
                                    exps[index].description = e.target.value;
                                    updateCv({ experiences: exps });
                                }} />
                            </div>
                            <div className="space-y-2">
                                <Label>Ansvar & Prestationer (En per rad)</Label>
                                <Textarea
                                    className="min-h-[100px]"
                                    value={exp.bullets.join("\n")}
                                    onChange={e => {
                                        const exps = [...cv.experiences];
                                        exps[index].bullets = e.target.value.split("\n");
                                        updateCv({ experiences: exps });
                                    }}
                                    placeholder="- Utvecklade nya funktioner i React..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <button
                    className="text-sm text-primary hover:underline"
                    onClick={() => updateCv({ experiences: [...cv.experiences, { id: crypto.randomUUID(), role: "", company: "", period: "", description: "", bullets: [] }] })}
                >
                    + Lägg till Erfarenhet
                </button>
            </div>

            {/* Education simplified for MVP */}
        </div>
    );
}
