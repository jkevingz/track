<template>
    <a-drawer :title="`${isUpdate ? 'Update' : 'Create'} track`" :width="720" :open="openDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose">
        <a-spin :spinning="trackStore.loading">
            <a-form @finish="onFinish" :model="formState" :rules="rules" layout="vertical">
                <a-form-item label="Title" name="title" v-bind="validateInfos.title">
                    <a-input v-model:value="formState.title" placeholder="Please enter user title" />
                </a-form-item>

                <a-form-item label="ISCR" name="isrc" v-bind="validateInfos.isrc">
                    <a-input v-model:value="formState.isrc" style="width: 100%" placeholder="please enter isrc" />
                </a-form-item>

                <a-form-item label="Release Date" name="release_date">
                    <a-date-picker v-model:value="formState.release_date" style="width: 100%"
                        :get-popup-container="trigger => trigger.parentElement" />
                </a-form-item>

                <a-form-item label="Artists" name="artists">
                    <artist-select v-model="formState.artists" />
                </a-form-item>

                <input type="submit" hidden />
            </a-form>
        </a-spin>
        <template #extra>
            <a-space>
                <a-button @click="onClose">Cancel</a-button>
                <a-button :disabled="trackStore.loading" type="primary" @click="onFinish">Submit</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import ArtistSelect from '../form/ArtistSelect.vue';
import { storeToRefs } from 'pinia';
import { Form, message } from 'ant-design-vue';
import { useTrackStore } from '../../stores/track';
import dayjs from 'dayjs';

const useForm = Form.useForm;

const trackStore = useTrackStore();

const onClose = () => trackStore.closeTrackDrawer();

const emits = defineEmits(['success']);

const formState = reactive({ title: '', isrc: '', release_date: null, artists: [], id: null });
const rules = reactive({
    title: [
        {
            required: true,
            message: 'Please enter user name',
        },
    ],
    isrc: [
        {
            required: true,
            message: 'please enter a valid url',
            type: 'url',
        },
    ],
});

const { validate, validateInfos, resetFields } = useForm(formState, rules);

const onFinish = async () => {
    try {
        await validate();
    } catch {
        return;
    }

    try {
        isUpdate.value
            ? await trackStore.update(formState.id, formState)
            : await trackStore.create(formState);
        message.success(`Track ${isUpdate.value ? 'updated' : 'created'} successfully.`)
        trackStore.closeTrackDrawer();
        emits('success');
    } catch (error) {
        message.error(
            error?.response?.data?.detail ||
            `Unable to ${isUpdate.value ? 'update' : 'create'} track. Please try again later.`
        );
    }
};

const isUpdate = computed(() => !!formState.id);

const { itemForForm, openDrawer } = storeToRefs(trackStore);
const setFormState = (value = null) => {
    resetFields({
        title: value?.title || '',
        isrc: value?.isrc || '',
        release_date: value?.release_date ? dayjs(value.release_date) : null,
        artists: (value?.artists || []).map(artist => artist['@id']),
        id: value?.id || null,
    });
};
watch([itemForForm, openDrawer], ([value, open]) => {
    if (!open) {
        return;
    }
    setFormState(value);
});
</script>
