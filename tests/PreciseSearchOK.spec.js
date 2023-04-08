/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest';
import { mount } from "@vue/test-utils";
import AnimeSearch from "../src/components/AnimeSearch.vue";

describe("SearchAnime", () => {

    it("should search for anime with precise search type", async () => {
        const wrapper = mount(AnimeSearch);
        const searchQueryInput = wrapper.find("#search-input");
        const searchButton = wrapper.find("button");
        const preciseSearchType = wrapper.findAll("input[type='radio']")[1];

        await searchQueryInput.setValue("Naruto");
        await preciseSearchType.trigger("click");
        await searchButton.trigger("click");

        expect(wrapper.vm.$data.singleAnime).not.toBeNull();
    });
});