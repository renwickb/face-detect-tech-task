<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { VForm } from "vuetify/components";
import * as yup from "yup";
import { validate } from "@/helper";
import router from "@/router";

const authStore = useAuthStore();

const form = ref<VForm | null>(null);
const username = ref("");
const password = ref("");
const error = ref<string | null>(null);
const isLoading = ref(false);

const usernameValidationSchema = yup
    .string()
    .required("Please provide a username")
    .email("Please use an email address for your username");

const passwordValidationSchema = yup
    .string()
    .required("Please provide a password")
    .min(5, "Your password should be at least 5 characters");

async function onSignup() {
    isLoading.value = true;
    error.value = null;
    try {
        if (form.value) {
            const { valid } = await form.value.validate();
            if (valid) {
                const { signup } = authStore;

                await signup(username.value, password.value);
                await router.replace({ name: "home" });
            }
        }
    } catch (err) {
        error.value = "Cannot sign-up at this time";
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <v-card text="Sign-up" :loading="isLoading">
        <v-container fluid>
            <v-form ref="form">
                <v-text-field
                    v-model="username"
                    placeholder="user@example.com"
                    label="Username"
                    required
                    :rules="[(v) => validate(v, usernameValidationSchema)]"
                />
                <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                    :rules="[(v) => validate(v, passwordValidationSchema)]"
                />
            </v-form>

            <v-alert type="error" class="mb-4" v-if="!!error">
                {{ error }}</v-alert
            >
        </v-container>

        <v-card-actions>
            <v-btn color="success" class="mr-4" @click="onSignup"
                >Sign-up</v-btn
            >
        </v-card-actions>
    </v-card>
</template>
