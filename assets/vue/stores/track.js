import { defineStore } from 'pinia';
import { useEntityStore } from './entity_base';
import { ref } from 'vue';

const BASE_URL = 'tracks';

export const useTrackStore = defineStore('tracks', () => {
    const openDrawer = ref(false);

    const store = useEntityStore(BASE_URL);
    const openTrackDrawer = (data = null) => {
        store.setItemForForm(data);
        openDrawer.value = true;
    };
    const closeTrackDrawer = () => {
        openDrawer.value = false;
    };
    return { ...store, openTrackDrawer, closeTrackDrawer, openDrawer };
});
