import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const USER_TOKEN_KEY = 'USER_TOKEN';

export const useAuthStore = defineStore('auth', () => {
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

    return { token, isAuthenticated, setToken, clearToken };
});
