<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title font-semibold">登录</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { login } from "@/api/login";
import router from "@/router";

// 表单数据模型
const loginForm = ref({
  username: "",
  password: "",
});

// 表单验证规则
const rules = {
  username: [
    { required: true, message: "Please input username", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
  ],
};

// 引用 el-form 组件实例
const loginFormRef = ref<any>(null);

// 登录处理函数
const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 在这里执行登录逻辑，比如请求 API
      login(loginForm.value)
        .then((res) => {
          ElMessage.success(`欢迎回来 ${res.result.username}`);
          //   导航到首页
          router.push({
            name: "KnowledgePage",
            params: { username: res.result.username },
          });
        })
        .catch((err) => {
          ElMessage.error("登录失败");
          console.log(err);
        });
    } else {
      ElMessage.error("Please fill in the form correctly");
      return false;
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
