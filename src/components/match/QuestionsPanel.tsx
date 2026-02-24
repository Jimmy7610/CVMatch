import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";

export function QuestionsPanel({
    questions,
    onDismiss,
    onConfirm
}: {
    questions: { text: string; category: string }[],
    onDismiss?: (q: string) => void,
    onConfirm?: (q: string) => void
}) {
    const [localDismissed, setLocalDismissed] = useState<Set<string>>(new Set());

    if (!questions || questions.length === 0) return null;

    const visibleQuestions = questions.filter(q => {
        const reqText = q.text.replace("Har du erfarenhet av: ", "").replace("?", "");
        return !localDismissed.has(reqText);
    });

    if (visibleQuestions.length === 0) return null;

    const handleDismiss = (reqText: string) => {
        setLocalDismissed(prev => new Set(prev).add(reqText));
        onDismiss?.(reqText);
    };

    const grouped = visibleQuestions.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = [];
        acc[q.category].push(q);
        return acc;
    }, {} as Record<string, { text: string; category: string }[]>);

    return (
        <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                    <AlertCircle className="h-5 w-5" /> Behöver förtydligas
                </CardTitle>
                <CardDescription>
                    Jobbet kräver nedanstående, men det fanns inte tydligt i ditt CV.
                    Har du denna erfarenhet? (Gå tillbaka till ditt Master CV för att lägga till det om du vill).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.entries(grouped).map(([category, catQuestions]) => (
                    <div key={category} className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-800/60 dark:text-amber-400/60 ml-1">
                            {category}
                        </h4>
                        <div className="space-y-3">
                            {catQuestions.map((q, i) => {
                                const reqText = q.text.replace("Har du erfarenhet av: ", "").replace("?", "");
                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-3 p-3 rounded-md bg-background border shadow-sm border-amber-200/50 dark:border-amber-900/50"
                                    >
                                        <p className="text-sm font-medium">{q.text}</p>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs gap-1 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => onConfirm?.(reqText)}
                                            >
                                                <ThumbsUp className="h-3 w-3" /> Ja
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 text-xs gap-1 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => handleDismiss(reqText)}
                                            >
                                                <ThumbsDown className="h-3 w-3" /> Nej
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
