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
                'Content-Type': 'application/ld+json',
            },
        });
    });

    const handleRequest = async (callback) => {
        try {
            return await callback();
        } catch (error) {
            if (error?.response?.data?.code == 401) {
                return authStore.logout();
            }
            console.log('ehree');
            throw error;
        }
    };

    const post = (url, data = {}) => handleRequest(() => axios.value.post(url, data));

    const get = (url, query = {}) => handleRequest(() => axios.value.get(url, { params: query }));

    const put = (url, data = {}) => handleRequest(() => axios.value.put(url, data));

    const destroy = (url) => handleRequest(() => axios.value.delete(url));

    const request = (config) => handleRequest(() => axios.value.request(config));

    return { post, get, put, delete: destroy, request, axios };
};
