<template>
    <a-row :gutter="16">
        <a-col :span="12">
            <a-card>
                <artist-grid />
            </a-card>
        </a-col>
        <a-col :span="12">
            <a-card>
                <artist-form />
            </a-card>
        </a-col>
    </a-row>
</template>

<script setup>
import ArtistGrid from '../components/artist/ArtistGrid.vue';
import ArtistForm from '../components/artist/ArtistForm.vue';
</script>
