<script setup lang="ts">
import { ref, nextTick } from "vue";
import { VForm } from "vuetify/components";
import { validate } from "@/helper";
import * as yup from "yup";
import { useDetectStore } from "@/stores/detect";

const store = useDetectStore();

const form = ref<VForm | null>(null);
const files = ref<Array<File>>([]);
const imageAnnotation = ref("");
const error = ref<string | null>(null);

const fileValidationSchema = yup
    .array()
    .min(1, "Please select an image to upload");

const imageAnnotationValidationSchema = yup
    .string()
    .required("Please provide an annotation for this image");

async function onCreateTask() {
    error.value = null;
    try {
        if (form.value) {
            const { valid } = await form.value.validate();

            if (valid && files.value && files.value.length > 0) {
                await store.createTask(files.value[0], imageAnnotation.value);
                await onReset();
            }
        }
    } catch (err) {
        error.value = (err as Error).message;
    }
}

async function onReset() {
    files.value = [];
    imageAnnotation.value = "";

    nextTick(() => form.value?.resetValidation());
}
</script>

<template>
    <v-card title="Upload a New Image">
        <v-container fluid>
            <v-form ref="form">
                <v-file-input
                    v-model="files"
                    label="Choose an image"
                    required
                    show-size
                    chips
                    accept="image/png, image/jpeg"
                    :rules="[(v) => validate(v, fileValidationSchema)]"
                />
                <v-text-field
                    v-model="imageAnnotation"
                    placeholder="e.g. picture from last trip"
                    name="imageAnnotation"
                    label="Annotation"
                    required
                    :rules="[
                        (v) => validate(v, imageAnnotationValidationSchema),
                    ]"
                />
            </v-form>

            <v-alert type="error" class="mb-4" v-if="!!error">
                {{ error }}
            </v-alert>
        </v-container>

        <v-card-actions>
            <v-btn color="success" class="mr-4" @click.prevent="onCreateTask">
                Upload
            </v-btn>
            <v-btn color="secondary" @click.prevent="onReset"> Reset </v-btn>
        </v-card-actions>
    </v-card>
</template>
