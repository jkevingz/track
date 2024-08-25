import { registerVueControllerComponents } from '@symfony/ux-vue';
import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import Login from './vue/pages/Login.vue';
import Track from './vue/pages/Track.vue';
import Artist from './vue/pages/Artist.vue';
import { useAuthStore } from './vue/stores/auth.js';

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/));

document.addEventListener('vue:before-mount', (event) => {
    const { app } = event.detail;

    const pinia = createPinia();
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            { path: '/login', component: Login, name: 'login' },
            { path: '/track', component: Track },
            { path: '/artist', component: Artist },
            { path: '/:pathMatch(.*)*', redirect: '/login' },
        ],
    });
    router.beforeEach((to) => {
        const store = useAuthStore();
        const isAuthenticated = store.isAuthenticated;
        if (to.name == 'login' && isAuthenticated) return '/track';
        if (to.name != 'login' && !isAuthenticated) return '/login';
    });

    app.use(pinia).use(router);
});
