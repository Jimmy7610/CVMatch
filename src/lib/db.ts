import Dexie, { type EntityTable } from 'dexie';
import type { Profile, Job, Version, RewriteSettings, Confirmation } from '../types';

export const db = new Dexie('cvmatchdb') as Dexie & {
    profile: EntityTable<Profile, 'id'>;
    jobs: EntityTable<Job, 'id'>;
    versions: EntityTable<Version, 'id'>;
    settings: EntityTable<RewriteSettings, 'id'>;
    confirmations: EntityTable<Confirmation, 'id'>;
};

// Schema Definition
db.version(1).stores({
    profile: 'id', // Usually just 'me'
    jobs: 'id',
    versions: 'id, jobId', // jobId is an index for quick lookup
    settings: 'id', // Usually just 'app'
    confirmations: 'id, key'
});
