export interface Proposal {
    id: string;
    title: string;
    path: string;
    tags: string[];
    body: Record<string, never>;
}
