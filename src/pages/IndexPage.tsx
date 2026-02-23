import { Link } from "react-router-dom";
import { useMasterCv } from "../hooks/useMasterCv";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IndexPage() {
    const { profile, loading } = useMasterCv();

    if (loading) return null;

    const hasCv = !!profile?.masterCvJson.profile || (profile?.masterCvJson.experiences && profile.masterCvJson.experiences.length > 0);

    return (
        <div className="max-w-3xl mx-auto space-y-8 mt-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Välkommen till CVMatch</h1>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                    Skräddarsy ditt CV lokalt i din webbläsare, utan att skicka din data till molnet.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card className={hasCv ? "border-muted" : "border-primary shadow-md"}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" /> 1. Mitt CV (Master)
                        </CardTitle>
                        <CardDescription>Bygg eller klistra in ditt grund-CV.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hasCv ? (
                            <p className="text-sm text-green-600 mb-4 font-medium">✓ Master CV är sparat.</p>
                        ) : (
                            <p className="text-sm text-muted-foreground mb-4">Du behöver ett Master CV innan du kan börja matcha.</p>
                        )}
                        <Button asChild variant={hasCv ? "outline" : "default"} className="w-full">
                            <Link to="/cv">Hantera CV <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className={!hasCv ? "opacity-50 pointer-events-none" : ""}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" /> 2. Hitta Jobb
                        </CardTitle>
                        <CardDescription>Ladda upp annonser och matcha ditt CV.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Klistra in en jobbannons och använd OCR för att extrahera kraven.</p>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/jobs">Mina Jobb <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
