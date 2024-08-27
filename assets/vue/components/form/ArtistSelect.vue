<template>
    <a-select v-model:value="model" :options="options" mode="multiple" placeholder="Please select artist"
        :filterOption="filterOption"
        :loading="artistStore.loading">
        <template #dropdownRender="{ menuNode: menu }">
            <a-spin :spinning="artistStore.loading">
                <v-nodes :vnodes="menu" />
    
                <a-divider style="margin: 4px 0" />
    
                <a-space style="padding: 4px 8px">
                    <a-input v-model:value="name" placeholder="Please enter artist" />
    
                    <a-button type="text" @click="addItem" :disabled="!name">
                        <template #icon>
                            <plus-outlined />
                        </template>
                        Add artist
                    </a-button>
                </a-space>
            </a-spin>
        </template>
    </a-select>
</template>

<script setup>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useArtistStore } from '../../stores/artist';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { PlusOutlined } from '@ant-design/icons-vue';

const filterOption = (value, option) => option.label.toLowerCase().includes((value || '').toLowerCase());

const model = defineModel();

const artistStore = useArtistStore();
const { data } = storeToRefs(artistStore);
const options = computed(() => data.value.map(artist => ({
    value: artist['@id'],
    label: artist.name,
})));
onMounted(() => {
    (async () => {
        try {
            artistStore.load();
        } catch {
            message.error('Unable to load artists. Please try again later.');
        }
    })();
});

const VNodes = defineComponent({
    props: {
        vnodes: {
            type: Object,
            required: true,
        },
    },
    render() {
        return this.vnodes;
    },
});

const name = ref();
const addItem = async () => {
    try {
        const response = await artistStore.create({ name: name.value });
        name.value = '';
        model.value.push(response.data['@id']);
    } catch (error) {
        console.log('model', model);
        console.log('er', error);
        message.error(
            error?.response?.data?.detail ||
            'Unable to create artist. Please try again later.'
        );
    }
};
</script>
