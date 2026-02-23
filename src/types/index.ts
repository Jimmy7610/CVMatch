export interface Profile {
    id: string; // usually a single instance 'me'
    updatedAt: string;
    masterCvJson: MasterCV;
}

// Master CV structure based on constraints:
// Section names roughly: Profil, Erfarenheter, Utbildning, Kompetenser, Certifikat, Språk, Länkar
export interface MasterCV {
    profile: string;
    experiences: Experience[];
    education: Education[];
    skills: string[];
    certifications: string[];
    languages: string[];
    links: string[];
}

export interface Experience {
    id: string; // Required for Ollama claims reference
    role: string;
    company: string;
    period: string;
    description: string;
    bullets: string[];
}

export interface Education {
    id: string;
    degree: string;
    school: string;
    period: string;
    description?: string;
}

export interface Job {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    company: string;
    sourceImageMeta?: string;
    extractedText: string;
    notes?: string;
}

export interface Version {
    id: string;
    jobId: string;
    createdAt: string;
    updatedAt: string;
    tailoredCvJson: MasterCV;
    changeLogJson: ChangeLog;
}

export interface ChangeLog {
    movedSections: string[];
    promotedExperiences: string[];
    removedToOther: string[];
    rephrasedBullets: { before: string; after: string }[];
}

export interface RewriteSettings {
    id: string; // 'app'
    rewriteMode: 'rule' | 'ollama';
    ollamaEndpoint: string;
    ollamaModel: string;
}

export interface Confirmation {
    id: string;
    key: string;
    value: boolean; // e.g., 'drivers_license': true
    createdAt: string;
}
