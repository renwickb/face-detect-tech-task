<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import type { User } from "@/services/auth";
import router from "./router";

const authStore = useAuthStore();

const isAuthenticated = ref(false);
const user = ref<User | null>(null);

authStore.$subscribe(() => {
    isAuthenticated.value = authStore.isAuthenticated;
    user.value = authStore.user;
});

async function onLogout() {
    await authStore.logout();
    await router.replace({ name: "login" });
}
</script>

<template>
    <v-app>
        <v-app-bar>
            <v-app-bar-title>Face Detection App</v-app-bar-title>
            <template v-slot:append v-if="isAuthenticated">
                <v-label class="mr-4">Logged in as {{ user?.email }}</v-label>
                <v-btn color="error" @click="onLogout">Logout</v-btn>
            </template>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <RouterView />
            </v-container>
        </v-main>
    </v-app>
</template>
