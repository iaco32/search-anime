import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("SearchStore", () => {
    // state
    const searchTitle = ref("");
    const typeSearch = ref("standard");

    // action
    function newSearch(newTitle: string, newType: string) {
        searchTitle.value = newTitle;
        typeSearch.value = newType;
    }

    return { searchTitle, typeSearch, newSearch }
})