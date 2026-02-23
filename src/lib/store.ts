import { useEffect, useState } from "react";
import { db } from "./db";
import type { AppSettings, Theme } from "../types";

const defaultSettings: AppSettings = {
    id: "app",
    rewriteMode: "rule",
    ollamaEndpoint: "http://localhost:11434",
    ollamaModel: "qwen2.5:7b",
    theme: "system"
};

export function applyTheme(theme: Theme) {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
    } else {
        root.classList.add(theme);
    }
}

export function useAppSettings() {
    const [settings, setSettings] = useState<AppSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const stored = await db.settings.get("app");
            if (stored) {
                if (!stored.theme) stored.theme = "system";
                setSettings(stored);
                applyTheme(stored.theme);
            } else {
                await db.settings.put(defaultSettings);
                applyTheme(defaultSettings.theme);
            }
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (settings.theme === "system") {
                applyTheme("system");
            }
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [settings.theme]);

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await db.settings.put(updated);
        if (newSettings.theme) {
            applyTheme(newSettings.theme);
        }
    };

    return { settings, updateSettings, loading };
}
