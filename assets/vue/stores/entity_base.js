import { ref } from 'vue';
import { useRequest } from '../composables/useRequest';

export const useEntityStore = (baseUrl) => {
    const request = useRequest();
    const data = ref([]);
    const loading = ref(false);
    const itemForForm = ref();
    const inited = ref(false);

    const handleRequest = async (callback) => {
        loading.value = true;
        try {
            return await callback();
        } finally {
            loading.value = false;
        }
    };

    const load = async (force = false) => {
        if (inited.value && !force) {
            return;
        }
        inited.value = true;
        return handleRequest(async () => {
            const response = await request.get(baseUrl);
            data.value = response.data['hydra:member'];
            return response;
        });
    };

    const create = async (item) => handleRequest(async () => {
        const response = await request.post(baseUrl, item);
        data.value = [response.data, ...data.value];
        return response;
    });

    const update = async (id, item) => handleRequest(async () => {
        const response = await request.put(`${baseUrl}/${id}`, item);
        data.value = data.value.map((record) => {
            if (record.id == id) {
                return response.data;
            }

            return record;
        });
        return response;
    });

    const destroy = async (id) => handleRequest(async () => {
        const response = await request.delete(`${baseUrl}/${id}`);
        data.value = data.value.filter(record => record.id != id);
        return response;
    });

    const setItemForForm = (item = null) => itemForForm.value = item;

    return { load, data, loading, itemForForm, setItemForForm, create, update, delete: destroy };
};
