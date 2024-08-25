import axios from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const USER_TOKEN_KEY = 'USER_TOKEN';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const token = ref();
    token.value = localStorage.getItem(USER_TOKEN_KEY);

    const isAuthenticated = computed(() => !!token.value);

    const setToken = (value) => {
        token.value = value;
        localStorage.setItem(USER_TOKEN_KEY, value);
    };

    const clearToken = () => {
        token.value = null;
        localStorage.removeItem(USER_TOKEN_KEY);
    };

    const login = async (username, password) => {
        const response = await axios.post('/api/login_check', { username, password });
        setToken(response.data.token);
        router.push('/');
    };

    const logout = () => {
        clearToken();
        router.push('/login');
    };

    return { token, isAuthenticated, login, logout };
});
