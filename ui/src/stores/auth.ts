import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { authService, type User } from "@/services/auth";

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);
    const authToken = ref<string | null>(null);
    const authError = ref<Error | null>(null);
    const isAuthenticated = computed(() => !!user.value && !!authToken.value);

    async function login(username: string, password: string): Promise<void> {
        authError.value = null;
        try {
            const response = await authService.login(username, password);
            user.value = response.user;
            authToken.value = response.token;
        } catch (err) {
            authError.value = err as Error;
            throw err;
        }
    }

    async function logout(): Promise<void> {
        user.value = null;
        authToken.value = null;
        authError.value = null;
    }

    async function signup(username: string, password: string): Promise<void> {
        authError.value = null;
        try {
            const response = await authService.signup(username, password);
            user.value = response.user;
            authToken.value = response.token;
        } catch (err) {
            authError.value = err as Error;
            throw err;
        }
    }

    return { user, authToken, isAuthenticated, login, logout, signup };
});
