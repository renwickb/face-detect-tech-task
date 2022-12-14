<script setup lang="ts">
import DetectTaskCreate from "@/components/DetectTaskCreate.vue";
import DetectTaskSummary from "@/components/DetectTaskSummary.vue";
</script>

<template>
    <v-container class="mb-4">
        <DetectTaskCreate />
    </v-container>
    <Suspense>
        <DetectTaskSummary />
    </Suspense>
</template>
