<template>
    <div>
        <form @submit.prevent="searchToStore">
            <label class="switch-label">
                <input @change="toggleTheme" id="checkbox" type="checkbox" class="switch-checkbox" />
                <span>🌙</span>
                <span>☀️</span>
                <div class="switch-toggle" :class="{ 'switch-toggle-checked': userTheme === 'dark' }"></div>
            </label>
            <input id="search-input" type="text" v-model.trim="searchQuery" placeholder="Enter title (e.g: 'Naruto')" />
            <button @click="searchToStore">Search</button>
        </form>
        <div class="search-type">
            <label>
                <input id="standard-radio" type="radio" value="standard" v-model="searchType"> Standard Search
            </label>
            <label>
                <input id="precise-radio" type="radio" value="precise" v-model="searchType"> Single Search
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSearchStore } from "../store/SearchStore"

export type UserTheme = 'light' | 'dark';

const setTheme = (theme: UserTheme) => {
    localStorage.setItem('user-theme', theme);
    userTheme.value = theme;
    document.documentElement.className = theme;
};

// Remember the user's current preference.
const getTheme = (): UserTheme => {
    return localStorage.getItem('user-theme') as UserTheme;
};

// this is what happens when the user clicks on the switch:
// read out the local storage value for the user theme and, based on it, execute the setTheme method.
const toggleTheme = (): void => {
    const activeTheme = localStorage.getItem('user-theme');
    if (activeTheme === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
};

// initially set a user theme based on the user's browser settings.
const getMediaPreference = (): UserTheme => {
    const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (hasDarkPreference) {
        return 'dark';
    } else {
        return 'light';
    }
};

// set userTheme value from localStorage or from user's browser setiings.
const userTheme = ref<UserTheme>(getTheme() || getMediaPreference());

// Pinia Store
const store = useSearchStore();
const { newSearch } = store;

const searchQuery = ref(" ");
const searchType = ref("standard");

// Call Store Action
const searchToStore = () => {
    newSearch(searchQuery.value, searchType.value);
}

onMounted(() => {
    setTheme(userTheme.value)
});
</script>