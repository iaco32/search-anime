<template>
    <form @submit.prevent="searchAnime">
        <input id="search-input" type="text" v-model.trim="searchQuery"
            placeholder="Enter title to search (e.g: 'Naruto')..." />
        <button @click="searchAnime">Search</button>
    </form>
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

                        <p v-html="anime.description"></p>
                        <p v-if="anime.nextAiringEpisode"><strong>
                                Next Episode Number:</strong> {{ anime.nextAiringEpisode.episode }} at ({{
                                    anime.nextAiringEpisode.airingAt
                                    ?
                                    new
                                        Date(anime.nextAiringEpisode.airingAt *
                                            1000).toLocaleString() : "" }})
                        </p>
                        <p v-else class="anime-airing"><strong>The anime finished airing.</strong> The last episode was
                            aired on: {{
                                anime.endDate?.year ? formatDate(anime.endDate) : "Unknown" }}</p>
                        <p><strong>Average Rating Score:</strong> {{ anime.averageScore }}/100</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { Anime } from "../types/AniListInterface";

const searchQuery = ref("");
const searchType = ref("standard");
const animeList = ref<Anime[]>([]);
const singleAnime = ref<Anime | null>(null);
const loading = ref(false);
const error = ref("");
const noAnimeFound = ref(false);

const pageQuery = `
    query ($search: String) {
      Page {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          description
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          averageScore
          coverImage {
            medium
            large
          }
          episodes
          status
          nextAiringEpisode {
            episode
            airingAt
          }
        }
      }
    }
  `;


const searchAnime = async () => {
    if (searchQuery.value.trim() === "") {
        error.value = "Please enter a search query.";
        return;
    }

    loading.value = true;
    error.value = "";
    animeList.value = [];
    noAnimeFound.value = false;

    try {
        const result = await searchAnilist();
        animeList.value = result;
    } catch (err) {
        error.value = (err as Error).message;
    } finally {
        loading.value = false;
    }
};

const searchAnilist = async (): Promise<Anime[]> => {

    const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: pageQuery,
            variables: { search: searchQuery.value }
        }),
    });

    const { data, errors } = await response.json();

    if (errors) {
        throw new Error(errors[0].message);
    }
    if (data.Page.media.length === 0) noAnimeFound.value = true;
    return data.Page.media;
};

const formatDate = (date: { year: number; month?: number; day?: number }): string => {
    const monthString = date.month ? `0${date.month}`.slice(-2) : "01";
    const dayString = date.day ? `0${date.day}`.slice(-2) : "01";
    return `${dayString}.${monthString}.${date.year}`;
};
</script>