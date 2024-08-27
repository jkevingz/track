<template>
    <a-layout class="layout">
        <a-layout-sider v-model:collapsed="collapsed" collapsible>
            <div class="logo">
                Track App
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item key="Login" v-if="!authStore.isAuthenticated">
                    <login-outlined />
                    <span>Login</span>
                </a-menu-item>
                <a-menu-item key="Tracks" v-if="authStore.isAuthenticated">
                    <router-link to="/track">
                        <sound-outlined />
                        <span>Tracks</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="Artists" v-if="authStore.isAuthenticated">
                    <router-link to="/artist">
                        <user-outlined />
                        <span>Artists</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="Logout" v-if="authStore.isAuthenticated" @click="logout()">
                    <logout-outlined />
                    <span>Logout</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header class="header">
                <a-typography-title :level="2" class="header-title">
                    {{ route.name }}
                </a-typography-title>
                <div v-if="route.name == 'Artists'">
                    <a-button :disabled="!artistStore.itemForForm?.id" type="primary" @click="clearArtistToUpdate()">Add</a-button>
                </div>
                <div v-if="route.name == 'Tracks'">
                    <a-button type="primary" @click="openTrackDrawer()">Add</a-button>
                </div>
            </a-layout-header>
            <a-layout-content class="content">
                <div class="inner-content">
                    <router-view></router-view>
                </div>
            </a-layout-content>
            <a-layout-footer class="footer">
                Track App ©{{ new Date().getFullYear() }} Created by Kevin Garcia
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { SoundOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { useArtistStore } from '../stores/artist';
import { useTrackStore } from '../stores/track';
const collapsed = ref(false);
const selectedKeys = ref([]);
const route = useRoute();
const authStore = useAuthStore();
watch(route, (value) => {
    selectedKeys.value = [value.name];
});

const logout = () => authStore.logout();

const artistStore = useArtistStore();
const clearArtistToUpdate = () => artistStore.setItemForForm();

const trackStore = useTrackStore();
const openTrackDrawer = () => trackStore.openTrackDrawer();
</script>

<style scoped>
.layout {
    min-height: 100vh;
}
.logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
}
.header {
    background: #FFFFFF;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.header-title {
    margin: 0;
}
.content {
    margin: 16px;
}
.inner-content {
    padding: 24px;
    background: #FFFFFF;
    min-height: calc(100vh - 160px);
    height: 100%;
}
.footer {
    text-align: center;
}
</style>
