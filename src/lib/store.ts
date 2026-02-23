import { useEffect, useState } from "react";
import { db } from "./db";
import type { RewriteSettings } from "../types";

const defaultSettings: RewriteSettings = {
    id: "app",
    rewriteMode: "rule",
    ollamaEndpoint: "http://localhost:11434",
    ollamaModel: "qwen2.5:7b"
};

export function useRewriteSettings() {
    const [settings, setSettings] = useState<RewriteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const stored = await db.settings.get("app");
            if (stored) {
                setSettings(stored);
            } else {
                await db.settings.put(defaultSettings);
            }
            setLoading(false);
        }
        load();
    }, []);

    const updateSettings = async (newSettings: Partial<RewriteSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await db.settings.put(updated);
    };

    return { settings, updateSettings, loading };
}
