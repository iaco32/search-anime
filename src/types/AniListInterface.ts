export interface Anime {
    id: number;
    title: {
        romaji: string;
    };
    description: string;
    endDate?: {
        year: number;
        month: number;
        day: number;
    };
    averageScore?: number;
    coverImage: {
        large: string;
    };
    nextAiringEpisode: {
        episode?: number;
        airingAt?: number;
    };
}    
