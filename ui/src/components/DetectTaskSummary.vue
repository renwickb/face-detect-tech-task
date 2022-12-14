<script setup lang="ts">
import { ref } from "vue";
import type { DetectTask } from "@/services/detect";
import { useDetectStore } from "@/stores/detect";
import DetectTaskItem from "./DetectTaskItem.vue";

defineProps<{
    showUser?: boolean;
}>();

const store = useDetectStore();
const tasks = ref<Array<DetectTask>>([]);

store.$subscribe(() => {
    tasks.value = store.taskList;
});

await store.getAllTasks();
</script>

<template>
    <v-table density="compact">
        <thead>
            <tr>
                <th v-if="showUser">User</th>
                <th>Filename</th>
                <th>Annotation</th>
                <th>Status</th>
                <th># Faces Detected</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
            <DetectTaskItem
                v-for="task in tasks"
                :key="task.trackingId"
                :task="task"
            />
        </tbody>
    </v-table>
</template>
