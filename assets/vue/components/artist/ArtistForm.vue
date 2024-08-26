<template>
    <a-spin :spinning="artistStore.loading">
        <a-form :model="formState" @finish="onFinish" layout="vertical">
            <a-form-item label="Name" name="name"
                :rules="[{ required: true, message: 'Please input your name!' }]">
                <a-input v-model:value="formState.name" />
            </a-form-item>

            <a-form-item>
                <a-button :disabled="disabled" type="primary" html-type="submit">
                    {{ isUpdate ? 'Update' : 'Create' }}
                </a-button>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
import { useArtistStore } from '../../stores/artist';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

const artistStore = useArtistStore();

const emits = defineEmits(['success']);

const formState = reactive({ name: '', id: null });
const onFinish = async ({ name }) => {
    try {
        isUpdate.value
            ? await artistStore.update(formState.id, { name })
            : await artistStore.create({ name });
        artistStore.setItemForForm();
        setFormState();
        message.success(`Artist ${isUpdate.value ? 'updated' : 'created'} successfully.`)
        emits('success');
    } catch (error) {
        message.error(
            error?.response?.data?.detail ||
            `Unable to ${isUpdate.value ? 'update' : 'create'} artist. Please try again later.`
        );
    }
};

const disabled = computed(() => !formState.name);

const isUpdate = computed(() => !!formState.id);

const { itemForForm } = storeToRefs(artistStore);
const setFormState = (value = null) => {
    formState.name = value?.name || '';
    formState.id = value?.id || null;
};
watch(itemForForm, setFormState);
</script>
