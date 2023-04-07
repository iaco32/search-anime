/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest';
import { mount } from "@vue/test-utils";
import AnimeSearch from "../src/components/AnimeSearch.vue";

describe("SearchAnime", () => {

    it("should search for a list of anime", async () => {
        const wrapper = mount(AnimeSearch);
        const searchQueryInput = wrapper.find("#search-input");
        const searchButton = wrapper.find("button");

        await searchQueryInput.setValue("Naruto");
        await searchButton.trigger("click");

        expect(wrapper.vm.$data.animeList).not.toBeNull();
    });
});