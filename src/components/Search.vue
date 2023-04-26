<template>
    <div>
        <form @submit.prevent="searchToStore">
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
import { ref } from "vue";
import { useSearchStore } from "../store/SearchStore"

const store = useSearchStore();
const { newSearch } = store;

const searchQuery = ref(" ");
const searchType = ref("standard");

// Call Store Action
const searchToStore = () => {
    newSearch(searchQuery.value, searchType.value);
}
</script>