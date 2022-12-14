<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import type { AdminSummary } from "@/services/detect";
import { useDetectStore } from "@/stores/detect";
import AdminSummaryItem from "./AdminSummaryItem.vue";

const store = useDetectStore();
const adminSummary = ref<AdminSummary | null>(null);

store.$subscribe(() => {
    adminSummary.value = store.adminSummary;
});

await store.getAdminSummry();
store.watchSummary();

onUnmounted(() => store.unwatchSummary);
</script>

<template>
    <v-table density="compact">
        <thead>
            <tr>
                <th>User</th>
                <th># Images</th>
                <th># Faces Detected</th>
            </tr>
        </thead>
        <tbody>
            <AdminSummaryItem
                v-for="item in adminSummary?.summary"
                :key="item.userEmail"
                :summary-item="item"
            />
        </tbody>
    </v-table>
</template>
