<script setup lang="ts">
import AdminSummary from "@/components/AdminSummary.vue";
</script>

<template>
    <v-card title="Administration Summary">
        <Suspense>
            <AdminSummary />
        </Suspense>
    </v-card>
</template>
