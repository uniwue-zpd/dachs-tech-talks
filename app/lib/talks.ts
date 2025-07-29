// lib/talks.ts

export interface Talk {
    path: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location?: string; // New optional location property
    category: string;
    speaker: string;
    tags: string[];
    body: Record<string, never>;
}

export interface Category {
    slug: string;
    name: string;
    class: string;
    gradientClass: string;
}

export const CATEGORIES: Record<string, Category> = {
    'library-spotlight': { slug: 'library-spotlight', name: 'Library Spotlight', class: 'bg-blue-100 text-blue-800 border-blue-200', gradientClass: 'bg-blue-500/30 text-blue-100 border-blue-400/50' },
    'framework-spotlight': { slug: 'framework-spotlight', name: 'Framework Spotlight', class: 'bg-emerald-100 text-emerald-800 border-emerald-200', gradientClass: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50' },
    'dev-tooling': { slug: 'dev-tooling', name: 'Dev Tooling', class: 'bg-purple-100 text-purple-800 border-purple-200', gradientClass: 'bg-purple-500/30 text-purple-100 border-purple-400/50' },
    'recent-bugs-fixes': { slug: 'recent-bugs-fixes', name: 'Recent Bugs & Fixes', class: 'bg-red-100 text-red-800 border-red-200', gradientClass: 'bg-red-500/30 text-red-100 border-red-400/50' },
    'release-radar': { slug: 'release-radar', name: 'Release Radar', class: 'bg-yellow-100 text-yellow-800 border-yellow-200', gradientClass: 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' },
    'behind-the-scenes': { slug: 'behind-the-scenes', name: 'Behind the Scenes', class: 'bg-gray-100 text-gray-800 border-gray-200', gradientClass: 'bg-gray-500/30 text-gray-100 border-gray-400/50' },
    'architecture-bits': { slug: 'architecture-bits', name: 'Architecture Bits', class: 'bg-indigo-100 text-indigo-800 border-indigo-200', gradientClass: 'bg-indigo-500/30 text-indigo-100 border-indigo-400/50' },
    'misc': { slug: 'misc', name: 'Misc', class: 'bg-pink-100 text-pink-800 border-pink-200', gradientClass: 'bg-pink-500/30 text-pink-100 border-pink-400/50' },
};

export const getCategoryBySlug = (slug?: string): Category | undefined => {
    if (!slug) return undefined;
    return CATEGORIES[slug.toLowerCase()];
}

export const getCategoryByName = (name?: string): Category | undefined => {
    if (!name) return undefined;
    return Object.values(CATEGORIES).find(c => c.name === name);
}

export const getCategoryNames = () => {
    return ['All Talks', ...Object.values(CATEGORIES).map(c => c.name)];
}
