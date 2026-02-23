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

export function useMasterCv() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    // Ref for debouncing saves
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        async function load() {
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
            setLoading(false);
        }
        load();

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (immediate) {
                db.profile.put(updatedProfile);
            } else {
                timeoutRef.current = setTimeout(() => {
                    db.profile.put(updatedProfile);
                }, 1000); // 1s debounce
            }

            return updatedProfile;
        });
    }, []);

    return { profile, updateCv, loading };
}
