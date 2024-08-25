import { registerVueControllerComponents } from '@symfony/ux-vue';
import './bootstrap.js';
import './styles/app.css';
import 'ant-design-vue/dist/reset.css';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Login from './vue/pages/Login.vue';
import Track from './vue/pages/Track.vue';
import Artist from './vue/pages/Artist.vue';
import { useAuthStore } from './vue/stores/auth.js';
import Antd from 'ant-design-vue';

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/));

document.addEventListener('vue:before-mount', (event) => {
    const { app } = event.detail;

    const pinia = createPinia();
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            { path: '/login', component: Login, name: 'Login' },
            { path: '/track', component: Track, name: 'Tracks' },
            { path: '/artist', component: Artist, name: 'Artists' },
            { path: '/:pathMatch(.*)*', redirect: '/track' },
        ],
    });
    router.beforeEach((to) => {
        const store = useAuthStore();
        const isAuthenticated = store.isAuthenticated;
        if (to.name == 'Login' && isAuthenticated) return '/';
        if (to.name != 'Login' && !isAuthenticated) return '/login';
    });

    app.use(pinia).use(router).use(Antd);
});
