import { ref, computed } from "vue";
import { defineStore } from "pinia";
import {
    type AdminSummary,
    detectService,
    DetectStatus,
    type DetectTask,
} from "@/services/detect";

export const useDetectStore = defineStore("detect", () => {
    const tasks = ref(new Map<string, DetectTask>());
    const adminSummary = ref<AdminSummary | null>(null);
    const error = ref<Error | null>(null);
    const summaryWatchHandle = ref<any | undefined>();

    const taskList = computed(() =>
        [...tasks.value.values()].sort((a, b) => {
            if (a.createdDate == b.createdDate) return 0;
            if (a.createdDate < b.createdDate) return 1;
            return -1;
        })
    );

    async function getAllTasks(): Promise<Array<DetectTask>> {
        tasks.value.clear();

        try {
            const allTasks = await detectService.getAllTasks();
            allTasks.forEach((task) => tasks.value.set(task.trackingId, task));
            return allTasks;
        } catch (err) {
            error.value = err as Error;
            throw err;
        }
    }

    async function refreshTaskStatus(trackingId: string): Promise<DetectTask> {
        try {
            const task = await detectService.getTaskStatus(trackingId);
            tasks.value.set(task.trackingId, task);
            return task;
        } catch (err) {
            error.value = err as Error;
            throw err;
        }
    }

    async function createTask(
        image: File,
        imageAnnotation: string
    ): Promise<DetectTask> {
        try {
            const task = await detectService.createTask(image, imageAnnotation);
            tasks.value.set(task.trackingId, task);

            watchTask(task.trackingId);

            return task;
        } catch (err) {
            error.value = err as Error;
            throw err;
        }
    }

    function watchTask(trackingId: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const timerHandle = setInterval(async () => {
                const task = await refreshTaskStatus(trackingId);
                if (
                    task.status === DetectStatus.Complete ||
                    task.status === DetectStatus.Failed
                ) {
                    clearInterval(timerHandle);
                    resolve();
                }
            }, 100);
        });
    }

    async function getAdminSummry(): Promise<AdminSummary> {
        try {
            const summary = await detectService.getAdminSummary();
            adminSummary.value = summary;

            return summary;
        } catch (err) {
            error.value = err as Error;
            throw err;
        }
    }

    function watchSummary(): void {
        if (!summaryWatchHandle.value) {
            summaryWatchHandle.value = setInterval(async () => {
                await getAdminSummry();
            }, 100);
        }
    }

    function unwatchSummary() {
        if (summaryWatchHandle.value) {
            clearInterval(summaryWatchHandle.value);
            summaryWatchHandle.value = undefined;
        }
    }

    return {
        tasks,
        taskList,
        adminSummary,
        getAllTasks,
        refreshTaskStatus,
        createTask,
        getAdminSummry,
        watchSummary,
        unwatchSummary,
    };
});
