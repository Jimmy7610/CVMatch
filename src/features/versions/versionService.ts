import { db } from "../../lib/db";
import type { Version, MasterCV, ChangeLog } from "../../types";

export const versionService = {
    async getByJobId(jobId: string): Promise<Version | undefined> {
        const versions = await db.versions.where('jobId').equals(jobId).toArray();
        // Return latest version for this job
        return versions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    },

    async create(jobId: string, tailoredCvJson: MasterCV, changeLogJson: ChangeLog, questions: { text: string; category: string }[]): Promise<string> {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        await db.versions.put({
            id,
            jobId,
            tailoredCvJson,
            changeLogJson,
            questions,
            createdAt: now,
            updatedAt: now
        });
        return id;
    },

    async updateQuestions(id: string, questions: { text: string; category: string }[]): Promise<void> {
        await db.versions.update(id, { questions });
    }
};
