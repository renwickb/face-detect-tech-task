<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import RouterLinks from "./components/RouterLinks.vue";

const authStore = useAuthStore();

const isAuthenticated = ref(false);

authStore.$subscribe(() => {
    isAuthenticated.value = authStore.isAuthenticated;
});
</script>

<template>
    <v-app>
        <v-app-bar>
            <v-app-bar-title>Face Detection App</v-app-bar-title>
            <template v-slot:append v-if="isAuthenticated">
                <RouterLinks />
            </template>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <RouterView />
            </v-container>
        </v-main>
    </v-app>
</template>
