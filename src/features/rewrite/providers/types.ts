import type { ChangeLog, MasterCV } from "../../../types";

export interface JobParsedData {
    title: string;
    requirements: string[];
    niceToHave: string[];
    responsibilities: string[];
    keywords: string[];
    dismissedRequirements?: string[]; // New: list of ignored tokens
}

export interface RewriteResult {
    tailoredCvJson: MasterCV;
    changeLogJson: ChangeLog;
    questions: { text: string; category: string }[];
}

export interface ProviderOptions {
    endpoint?: string;
    model?: string;
}

export interface RewriteProvider {
    rewrite(masterCvJson: MasterCV, jobJson: JobParsedData, options?: ProviderOptions): Promise<RewriteResult>;
    testConnection?(options?: ProviderOptions): Promise<boolean>;
}
