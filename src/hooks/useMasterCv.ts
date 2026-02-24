import { useEffect, useState, useCallback, useRef } from "react";
import { db } from "../lib/db";
import type { Profile, MasterCV } from "../types";

const defaultMasterCv: MasterCV = {
    profile: "",
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    links: []
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useMasterCv() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

    // Ref for debouncing saves and tracking pending changes
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingProfileRef = useRef<Profile | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const stored = await db.profile.get("me");
                if (stored) {
                    setProfile(stored);
                } else {
                    const initialProfile: Profile = {
                        id: "me",
                        updatedAt: new Date().toISOString(),
                        masterCvJson: defaultMasterCv
                    };
                    await db.profile.put(initialProfile);
                    setProfile(initialProfile);
                }
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        }
        load();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // Flush pending changes on unmount
            if (pendingProfileRef.current) {
                db.profile.put(pendingProfileRef.current).catch(err => {
                    console.error("Failed to flush profile on unmount:", err);
                });
            }
        }
    }, []);

    const saveToDb = useCallback(async (p: Profile) => {
        setSaveStatus("saving");
        try {
            await db.profile.put(p);
            setSaveStatus("saved");
            pendingProfileRef.current = null;
        } catch (err) {
            console.error("Failed to save profile:", err);
            setSaveStatus("error");
        }
    }, []);

    const updateCv = useCallback((newCv: Partial<MasterCV>, immediate = false) => {
        setProfile(prev => {
            if (!prev) return prev;
            const updatedProfile = {
                ...prev,
                updatedAt: new Date().toISOString(),
                masterCvJson: { ...prev.masterCvJson, ...newCv }
            };

            pendingProfileRef.current = updatedProfile;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (immediate) {
                saveToDb(updatedProfile);
            } else {
                setSaveStatus("idle");
                timeoutRef.current = setTimeout(() => {
                    saveToDb(updatedProfile);
                }, 1500); // 1.5s debounce to feel stable
            }

            return updatedProfile;
        });
    }, [saveToDb]);

    return { profile, updateCv, loading, saveStatus };
}
