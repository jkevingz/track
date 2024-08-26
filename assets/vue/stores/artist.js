import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRequest } from '../composables/useRequest';

const BASE_URL = 'artists';

export const useArtistStore = defineStore('artist', () => {
    const request = useRequest();
    const data = ref([]);
    const loading = ref(false);
    const itemForForm = ref();

    const load = async () => {
        loading.value = true;
        const response = await request.get(BASE_URL);
        data.value = response.data['hydra:member'];
        loading.value = false;
    };

    const create = async (item) => {
        loading.value = true;
        const response = await request.post(BASE_URL, item);
        data.value = [{ id: response.data.id, name: response.data.name }, ...data.value];
        loading.value = false;
    };

    const update = async (id, item) => {
        loading.value = true;
        const response = await request.put(`${BASE_URL}/${id}`, item);
        data.value = data.value.map((artist) => {
            if (artist.id == id) {
                artist.name = response.data.name;
            }

            return artist;
        })
        loading.value = false;
    };

    const destroy = async (id) => {
        loading.value = true;
        await request.delete(`${BASE_URL}/${id}`);
        data.value = data.value.filter(artist => artist.id != id);
        loading.value = false;
    };

    const setItemForForm = (item = null) => itemForForm.value = item;

    return { load, data, loading, itemForForm, setItemForForm, create, update, delete: destroy };
});
