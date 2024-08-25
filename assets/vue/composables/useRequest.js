import Axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

const BASE_URL = '/api';

export const useRequest = () => {
    const authStore = useAuthStore();

    const axios = computed(() => {
        const token = authStore.token;
        return Axios.create({
            baseURL: BASE_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    });

    const handleRequest = async (callback) => {
        try {
            return await callback();
        } catch (error) {
            // todo check error.
            console.error('error', error);
        }
    };

    const post = (url, data = {}) => handleRequest(() => axios.value.post(url, data));

    return { post };
};
