import { createRouter, createWebHistory } from "vue-router";
import KnowledgePage from "@/views/knowledge/IndexView.vue";

const routes = [
  {
    path: "/",
    name: "KnowledgePage",
    component: KnowledgePage,
  },
  // Add more routes here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
