import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

export function QuestionsPanel({ questions }: { questions: string[] }) {
    const [resolved, setResolved] = useState<Set<number>>(new Set());

    if (!questions || questions.length === 0) return null;

    const toggleResolved = (index: number) => {
        const next = new Set(resolved);
        if (next.has(index)) {
            next.delete(index);
        } else {
            next.add(index);
        }
        setResolved(next);
    };

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
            <CardContent className="space-y-3">
                {questions.map((q, i) => {
                    const isResolved = resolved.has(i);
                    return (
                        <div
                            key={i}
                            className={`flex items-start gap-3 p-3 rounded-md transition-colors ${isResolved ? 'opacity-50 bg-background' : 'bg-background border'}`}
                        >
                            <button
                                onClick={() => toggleResolved(i)}
                                className="mt-0.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                            >
                                <CheckCircle className={`h-5 w-5 ${isResolved ? 'text-green-500' : ''}`} />
                            </button>
                            <p className={`text-sm ${isResolved ? 'line-through' : ''}`}>{q}</p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
