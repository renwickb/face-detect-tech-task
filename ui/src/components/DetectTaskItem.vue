<script setup lang="ts">
import type { DetectTask } from "@/services/detect";

defineProps<{
    task: DetectTask;
    showUser?: boolean;
}>();
</script>

<template>
    <tr>
        <td v-if="showUser">
            {{ task.userEmail }}
        </td>
        <td>
            {{ task.filename }}
        </td>
        <td>
            {{ task.imageAnnotation }}
        </td>
        <td>
            {{ task.status }}
        </td>
        <td>
            {{ task.faceCount }}
        </td>
        <td>
            {{ task.createdDate }}
        </td>
    </tr>
</template>
