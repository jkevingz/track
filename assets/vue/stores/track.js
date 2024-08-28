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

    const uploadFile = (id, file) => store.handleRequest(async () => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await store.request({
            url: `${BASE_URL}/${id}/upload`,
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData,
        });
        store.refreshRecord(response.data);
    });

    return { ...store, openTrackDrawer, closeTrackDrawer, openDrawer, uploadFile };
});
