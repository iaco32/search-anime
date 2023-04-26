<template>
    <div class="anime-search-container">
        <div v-if="noAnimeFound" class="error-message">No anime found.</div>
        <div v-else-if="loading" class="loading-spinner"></div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="animeList.length">
            <div v-for="(anime, index) in animeList" :key="index" class="anime-details">
                <div>
                    <div class="anime-image">
                        <img :src="anime.coverImage.large" :alt="anime.title.romaji" />
                    </div>
                    <div class="anime-summary">
                        <h2>{{ anime.title.romaji }}</h2>

                        <transition name="fade">
                            <!-- here it used the v-html directive instead of the standard {{  }} 
                            because sometimes the anilist returns html formatted text
                            instead of simple text -->
                            <p v-if="!isExpanded[index]" v-html="shortText(anime.description)"
                                :class="shouldShowButton(anime.description) ? `fade-text` : `''`"></p>
                            <p v-else v-html="anime.description"></p>
                        </transition>

                        <p>
                            <button v-if="shouldShowButton(anime.description)"
                                @click="isExpanded[index] = !isExpanded[index]">
                                {{ isExpanded[index] ? 'Collapse' : 'Read more...' }}
                            </button>
                        </p>
                        <p v-if="anime.nextAiringEpisode"><strong>
                                Next Episode Number:</strong> {{ anime.nextAiringEpisode.episode }} at {{
                                    anime.nextAiringEpisode.airingAt
                                    ?
                                    new
                                        Date(anime.nextAiringEpisode.airingAt *
                                            1000).toLocaleString("de-DE").replace(",", " - ") : "" }}
                        </p>
                        <p v-else class="anime-airing"><strong>The anime finished airing.</strong> The last episode was
                            aired on: {{
                                anime.endDate?.year ? formatDate(anime.endDate) : "Unknown" }}</p>
                        <p><strong>Average Rating Score:</strong> {{ anime.averageScore }}/100</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="singleAnime">
            <div class="anime-details">
                <div class="anime-image">
                    <img :src="singleAnime.coverImage.large" :alt="singleAnime.title.romaji" />
                </div>
                <div class="anime-summary">
                    <h2>{{ singleAnime.title.romaji }}</h2>

                    <transition name="fade">
                        <p v-if="!isExpanded[0]" v-html="shortText(singleAnime.description)"
                            :class="shouldShowButton(singleAnime.description) ? `fade-text` : `''`"></p>
                        <p v-else v-html="singleAnime.description"></p>
                    </transition>

                    <p><button v-if="shouldShowButton(singleAnime.description)" @click="isExpanded[0] = !isExpanded[0]">
                            {{ isExpanded[0] ? 'Collapse' : 'Read more...' }}
                        </button></p>

                    <p v-if="singleAnime.nextAiringEpisode"><strong>
                            Next Episode Number:</strong> {{ singleAnime.nextAiringEpisode.episode }} at {{
                                singleAnime.nextAiringEpisode.airingAt ? new Date(singleAnime.nextAiringEpisode.airingAt *
                                    1000).toLocaleString("de-DE").replace(",", " - ") : "" }}
                    </p>
                    <p v-else class="anime-airing"><strong>The anime finished airing.</strong> The last episode was
                        aired on: {{
                            singleAnime.endDate?.year ? formatDate(singleAnime.endDate) : "Unknown" }}</p>
                    <p><strong>Average Rating Score:</strong> {{ singleAnime.averageScore }}/100</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { watch } from "vue";
import { useSearchStore } from "../store/SearchStore"
import { storeToRefs } from 'pinia'
import { Anime } from "../types/AniListInterface";

const animeList = ref<Anime[]>([]);
const singleAnime = ref<Anime | null>(null);
const loading = ref(false);
const error = ref("");
const noAnimeFound = ref(false);

const store = useSearchStore();
const { searchTitle, typeSearch } = storeToRefs(store);
const { newSearch } = store;

// Watching if there are changes in the store
watch([searchTitle, typeSearch], () => {
    searchAnime();
});

// this fuction returns a new object where each index of the array is set to false to show the "Read more..." button on a long text in a standard search 
function initializeIsExpanded(animeList: Ref<Anime[]>) {
    return animeList.value.reduce<Record<number, boolean>>((acc, _, index) => {
        return { ...acc, [index]: false };
    }, {});
}

const isExpanded = ref(initializeIsExpanded(animeList));

const shortText = (text: string) => {
    if (text == null) {
        return false;
    }

    const lines = text.split('. ');
    return lines.slice(0, 3).join('. ');
};

// this function is used to show the button "Read more..." when the parameter "paragraph" contains more than 3 "." 
// I originally chose to use the "\n" end-of-line character, but sometimes the lines were too long to display  
const shouldShowButton = (paragraph: string) => {
    // const lines = paragraph.split('\n');
    if (paragraph == null) {
        return false;
    }
    const lines = paragraph.split('. ');
    return lines.length > 3;
};

// this query is used to get a result list (standard search)
const pageQuery = `
    query ($search: String) {
      Page {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
          }
          description
          endDate {
            year
            month
            day
          }
          averageScore
          coverImage {
            large
          }
          nextAiringEpisode {
            episode
            airingAt
          }
        }
      }
    }
  `;

// this query is used to get a single result (single search)
const singleQuery = `
query ($search: String) {Media(search: $search, type: ANIME) {
    id
    title {
      romaji
    }
    description
    endDate {
      year
      month
      day
    }
    averageScore
    coverImage {
      large
    }
    nextAiringEpisode {
      episode
      airingAt
    }
}}
`;


const searchAnime = async () => {
    if (searchTitle.value.trim() === "") {
        error.value = "Please enter a search query.";
        return;
    }

    loading.value = true;
    error.value = "";
    animeList.value = [];
    noAnimeFound.value = false;
    isExpanded.value = initializeIsExpanded(animeList);

    try {
        if (typeSearch.value === "standard") {
            const result = await searchAnilist();
            animeList.value = result;
        } else {
            const result = await searchSingleAnilist();
            singleAnime.value = result;
        }
    } catch (err) {
        error.value = (err as Error).message;
    } finally {
        loading.value = false;
    }
};

// this is the main query to obtain results from AniList GraphQL API
// see https://anilist.gitbook.io/anilist-apiv2-docs/overview/graphql/getting-started for documentation
const searchAnilist = async (): Promise<Anime[]> => {

    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: pageQuery,
            variables: { search: searchTitle.value }
        }),
    });

    const { data, errors } = await response.json();

    if (errors) {
        throw new Error(errors[0].message);
    }
    if (data.Page.media.length === 0) noAnimeFound.value = true;
    return data.Page.media;
};

const searchSingleAnilist = async (): Promise<Anime> => {

    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: singleQuery,
            variables: { search: searchTitle.value }
        }),
    });

    const { data, errors } = await response.json();

    if (errors) {
        throw new Error(errors[0].message);
    }
    if (data.Media === null) noAnimeFound.value = true;
    return data.Media;
};

// function to format a date from API response object
const formatDate = (date: { year: number; month?: number; day?: number }): string => {
    const monthString = date.month ? `0${date.month}`.slice(-2) : "01";
    const dayString = date.day ? `0${date.day}`.slice(-2) : "01";
    return `${dayString}.${monthString}.${date.year}`;
};
</script>