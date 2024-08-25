<template>
    <div class="main">
        <a-card class="login-form" s>
            <a-typography-paragraph>
                Access the application using
                <ul>
                    <li>username: email@email.com</li>
                    <li>password: password</li>
                </ul>
            </a-typography-paragraph>

            <a-spin :spinning="loading">
                <a-form :model="formState" @finish="onFinish" layout="vertical">
                    <a-form-item label="Username" name="username"
                        :rules="[{ required: true, message: 'Please input your username!' }]">
                        <a-input v-model:value="formState.username">
                            <template #prefix>
                                <UserOutlined />
                            </template>
                        </a-input>
                    </a-form-item>
    
                    <a-form-item label="Password" name="password"
                        :rules="[{ required: true, message: 'Please input your password!' }]">
                        <a-input-password v-model:value="formState.password">
                            <template #prefix>
                                <LockOutlined />
                            </template>
                        </a-input-password>
                    </a-form-item>
    
                    <a-form-item>
                        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                            Log in
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-spin>
        </a-card>
    </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '../stores/auth';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();

const formState = reactive({
    username: 'email@email.com',
    password: 'password',
});
const loading = ref(false);
const onFinish = async ({ username, password }) => {
    loading.value = true;
    try {
        await authStore.login(username, password);
    } catch (error) {
        message.error(error?.response?.data?.message || 'Unable to log in. Try again later.');
        loading.value = false;
    }
};
const disabled = computed(() => {
    return !(formState.username && formState.password);
});
</script>

<style scoped>
.main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.login-form {
    width: 500px;
}

.login-form-button {
    width: 100%;
}
</style>
