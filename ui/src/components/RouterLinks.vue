<script setup lang="ts">
import router, { RouteName } from "@/router";
import { useAuthStore } from "@/stores/auth";
import { Role } from "@/services/auth";

const store = useAuthStore();

async function onLogout() {
    await store.logout();
    await router.replace({ name: "login" });
}

function redirect(routeName: string) {
    router.push({ name: routeName });
}
</script>

<template>
    <v-label class="mr-4">Logged in as {{ store.user?.email }}</v-label>
    <v-btn class="mr-4" @click.prevent="redirect(RouteName.home)">Home</v-btn>
    <v-btn
        class="mr-4"
        v-if="store.user?.role === Role.Administrator"
        @click.prevent="redirect(RouteName.admin)"
    >
        Admin
    </v-btn>
    <v-btn color="error" @click="onLogout">Logout</v-btn>
</template>
