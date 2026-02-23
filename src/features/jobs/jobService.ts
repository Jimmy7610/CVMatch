import { db } from "../../lib/db";
import type { Job } from "../../types";

export const jobService = {
    async getAll(): Promise<Job[]> {
        return db.jobs.orderBy('updatedAt').reverse().toArray();
    },

    async getById(id: string): Promise<Job | undefined> {
        return db.jobs.get(id);
    },

    async create(title: string, company: string = ""): Promise<string> {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await db.jobs.put({
            id,
            title,
            company,
            extractedText: "",
            createdAt: now,
            updatedAt: now,
        });
        return id;
    },

    async update(id: string, updates: Partial<Job>): Promise<void> {
        await db.jobs.update(id, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    },

    async delete(id: string): Promise<void> {
        await db.jobs.delete(id);
    }
};
