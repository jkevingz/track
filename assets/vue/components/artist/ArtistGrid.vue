<template>
    <a-table :columns="columns" :data-source="artistStore.data" :loading="artistStore.loading">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key == 'action'">
                <a-flex justify="space-evenly">
                    <a-button type="primary" shape="circle" :icon="h(EditOutlined)" @click="setItemToUpdate(record)"/>
                    <a-popconfirm
                        title="Are you sure delete this artist?"
                        ok-text="Yes"
                        cancel-text="No"
                        @confirm="destroy(record)"
                    >
                        <a-button type="primary" danger shape="circle" :icon="h(DeleteOutlined)" />
                    </a-popconfirm>
                </a-flex>
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { onMounted, h } from 'vue';
import { useArtistStore } from '../../stores/artist';
import { message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name), filterSearch: true,
    onFilter: (value, record) => record.name.startsWith(value), },
    { title: 'Actions', key: 'action' },
];

const artistStore = useArtistStore();

onMounted(() => {
    (async () => {
        try {
            artistStore.load();
        } catch {
            message.error('Unable to load information. Please try again later.');
        }
    })();
});

const setItemToUpdate = (item) => artistStore.setItemForForm(item);

const destroy = async (item) => {
    try {
        await artistStore.delete(item.id);
        message.success('Artist deleted successfully.');
    } catch (error) {
        message.error(
            error?.response?.data?.detail ||
            'Unable to delete artist. Please try again later.'
        );
    }
};
</script>
