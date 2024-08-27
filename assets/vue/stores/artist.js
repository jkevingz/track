import { defineStore } from 'pinia';
import { useEntityStore } from './entity_base';

const BASE_URL = 'artists';

export const useArtistStore = defineStore('artist', () => useEntityStore(BASE_URL));
