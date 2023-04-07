/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AnimeSearch from "../src/components/AnimeSearch.vue";

describe("AnimeSearch", () => {
    it("renders without errors", () => {
        const wrapper = mount(AnimeSearch);
        expect(wrapper.exists()).toBe(true);
    });
});