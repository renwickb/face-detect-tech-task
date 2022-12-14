<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { VForm } from "vuetify/components";
import { validate } from "@/helper";
import * as yup from "yup";
import router, { RouteName } from "@/router";

const authStore = useAuthStore();

const form = ref<VForm | null>(null);
const username = ref("");
const password = ref("");
const error = ref<string | null>(null);
const isLoading = ref(false);

const usernameValidationSchema = yup
    .string()
    .required("Please provide a username");

const passwordValidationSchema = yup
    .string()
    .required("Please provide a password");

async function onLogin() {
    isLoading.value = true;
    error.value = null;
    try {
        if (form.value) {
            const { valid } = await form.value.validate();
            if (valid) {
                const { login } = authStore;

                await login(username.value, password.value);
                await router.replace({ name: RouteName.home });
            }
        }
    } catch (err) {
        error.value = "Unable to login at this time";
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <v-card title="Login" :loading="isLoading">
        <v-container fluid>
            <v-form ref="form">
                <v-text-field
                    v-model="username"
                    placeholder="user@example.com"
                    name="username"
                    label="Username"
                    required
                    :rules="[(v) => validate(v, usernameValidationSchema)]"
                />
                <v-text-field
                    v-model="password"
                    name="password"
                    type="password"
                    label="Password"
                    required
                    :rules="[(v) => validate(v, passwordValidationSchema)]"
                />
            </v-form>

            <v-alert type="error" class="mb-4" v-if="!!error">
                {{ error }}
            </v-alert>
        </v-container>

        <v-card-actions>
            <v-btn color="success" class="mr-4" @click.prevent="onLogin">
                Login
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
