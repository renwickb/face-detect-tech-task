<script setup lang="ts">
import type { AdminSummaryItem } from "@/services/detect";

defineProps<{
    summaryItem: AdminSummaryItem;
}>();
</script>

<template>
    <tr>
        <td>
            {{ summaryItem.userEmail }}
        </td>
        <td>
            {{ summaryItem.imageCount }}
        </td>
        <td>
            {{ summaryItem.faceCount }}
        </td>
    </tr>
</template>
