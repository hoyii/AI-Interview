import { createRouter, createWebHistory } from "vue-router";
import KnowledgePage from "@/views/knowledge/IndexView.vue";
import KnowledgeDetail from "@/views/knowledge/KnowledgeDetail.vue";
import LoginPage from "@/views/login/LoginView.vue";
import ContentView from "@/views/content/ContentView.vue";

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/:username",
    name: "KnowledgePage",
    component: KnowledgePage,
  },
  {
    path: "/knowledge/:knowledgeId",
    name: "KnowledgeDetail",
    component: KnowledgeDetail,
  },
  {
    path: "/question/:questionId",
    name: "QuestionDetail",
    component: ContentView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 检查 token 是否有效（例如检查是否过期）
const isTokenValid = () => {
  return true;
  // const token = localStorage.getItem("token"); // 假设你把 token 存储在 localStorage 中
  // if (!token) {
  //   return false; // 如果没有 token，则认为无效
  // }

  // // 你可以在这里进一步检查 token 是否过期，假设 token 是一个 JWT，
  // // 可以解析其 payload 部分并检查过期时间，示例代码如下：
  // try {
  //   const decoded = JSON.parse(atob(token.split(".")[1])); // 解码 JWT 的 payload
  //   const expiry = decoded.exp * 1000; // 获取过期时间，假设 `exp` 字段为过期时间戳
  //   return expiry > Date.now(); // 如果当前时间超过过期时间，则无效
  // } catch (e) {
  //   return false; // 如果解码失败，认为 token 无效
  // }
};

// 导航守卫：检查 token 是否有效
router.beforeEach((to, _, next) => {
  if (to.name !== "LoginPage" && !isTokenValid()) {
    // 如果目标路由不是登录页面且 token 无效，跳转到登录页
    next({ name: "LoginPage" });
  } else {
    // 否则，继续执行路由导航
    next();
  }
});

export default router;
