import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";
import { useAuthStore } from "@/stores/auth";
import { Role } from "@/services/auth";

export enum RouteName {
    home = "home",
    login = "login",
    admin = "admin",
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/admin",
            name: "admin",
            component: AdminView,
        },
    ],
});

router.beforeResolve((to) => {
    const { isAuthenticated, user } = useAuthStore();

    console.log("user", user);

    if (!isAuthenticated) {
        if (to.name !== RouteName.login) {
            return { name: RouteName.login };
        }
    } else if (
        to.name === RouteName.admin &&
        user?.role !== Role.Administrator
    ) {
        return { name: RouteName.home };
    }
});

export default router;
