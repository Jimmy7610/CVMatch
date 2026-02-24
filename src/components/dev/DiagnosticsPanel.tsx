import { useState, useEffect } from "react";
import { db } from "../../lib/db";
import { useMasterCv } from "../../../hooks/useMasterCv";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Database, Activity } from "lucide-react";

export function DiagnosticsPanel() {
    const [open, setOpen] = useState(false);
    const { profile } = useMasterCv();
    const { id: jobId } = useParams();
    const [dbInfo, setDbInfo] = useState({ name: "", version: 0, tables: [] as string[] });

    useEffect(() => {
        setDbInfo({
            name: db.name,
            version: db.verno,
            tables: db.tables.map(t => t.name)
        });
    }, []);

    if (process.env.NODE_ENV === "production") return null;

    const masterCvSize = profile ? JSON.stringify(profile.masterCvJson).length : 0;

    return (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm">
            <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur">
                <CardHeader
                    className="py-2 px-4 cursor-pointer flex flex-row items-center justify-between"
                    onClick={() => setOpen(!open)}
                >
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Diagnostics
                    </CardTitle>
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </CardHeader>
                {open && (
                    <CardContent className="py-2 px-4 space-y-3 text-xs">
                        <div className="space-y-1">
                            <p className="font-bold flex items-center gap-1">
                                <Database className="h-3 w-3" /> Database
                            </p>
                            <p>Namn: {dbInfo.name}</p>
                            <p>Version: {dbInfo.version}</p>
                            <p>Tabeller: {dbInfo.tables.join(", ")}</p>
                        </div>
                        <div className="space-y-1 border-t pt-2">
                            <p className="font-bold">Master CV</p>
                            <p>Status: {profile ? "Laddad" : "Inte laddad"}</p>
                            <p>Storlek: {(masterCvSize / 1024).toFixed(2)} KB</p>
                            <p>Updaterad: {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleTimeString() : "Aldrig"}</p>
                        </div>
                        {jobId && (
                            <div className="space-y-1 border-t pt-2">
                                <p className="font-bold">Aktivt Jobb</p>
                                <p>ID: {jobId.slice(0, 8)}...</p>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
