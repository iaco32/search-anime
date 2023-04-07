export interface Anime {
    id: number;
    title: {
        romaji: string;
        english?: string;
        native?: string;
    };
    description: string;
    startDate?: {
        year: number;
        month: number;
        day: number;
    };
    endDate?: {
        year: number;
        month: number;
        day: number;
    };
    averageScore?: number;
    coverImage: {
        medium: string;
        large: string;
    };
    episodes?: number;
    status?: string;
    nextAiringEpisode: {
        episode?: number;
        airingAt?: number;
    };
}    
