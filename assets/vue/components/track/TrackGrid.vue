<template>
    <a-table :columns="columns" :data-source="trackStore.data" :loading="trackStore.loading">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key == 'action'">
                <a-flex justify="space-evenly">
                    <a-button type="primary" shape="circle" :icon="h(EditOutlined)" @click="setItemToUpdate(record)"/>
                    <a-popconfirm
                        title="Are you sure delete this track?"
                        ok-text="Yes"
                        cancel-text="No"
                        @confirm="destroy(record)"
                    >
                        <a-button type="primary" danger shape="circle" :icon="h(DeleteOutlined)" />
                    </a-popconfirm>
                </a-flex>
            </template>
            <template v-else-if="column.key == 'artists'">
                {{ record.artists.map(artist => artist.name).join(', ') }}
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { onMounted, h } from 'vue';
import { message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useTrackStore } from '../../stores/track';

const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Title', dataIndex: 'title', key: 'title', sorter: (a, b) =>  (a.title || '').localeCompare(b.title) },
    { title: 'ISRC', dataIndex: 'isrc', key: 'isrc', sorter: (a, b) =>  (a.isrc || '').localeCompare(b.isrc) },
    { title: 'Release Date', dataIndex: 'release_date', key: 'release_date', sorter: (a, b) =>  (a.release_date || '').localeCompare(b.release_date) },
    { title: 'Artists', key: 'artists' },
    { title: 'Actions', key: 'action' },
];

const trackStore = useTrackStore();

onMounted(() => {
    (async () => {
        try {
            trackStore.load();
        } catch {
            message.error('Unable to load information. Please try again later.');
        }
    })();
});

const setItemToUpdate = (item) => trackStore.openTrackDrawer(item);

const destroy = async (item) => {
    try {
        await trackStore.delete(item.id);
        message.success('Track deleted successfully.');
    } catch (error) {
        message.error(
            error?.response?.data?.detail ||
            'Unable to delete track. Please try again later.'
        );
    }
};
</script>
