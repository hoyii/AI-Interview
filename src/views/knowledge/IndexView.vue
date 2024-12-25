<template>
  <div class="p-10 gap-10 w-full h-full overflow-y-auto">
    <header>
      <h1 class="mb-10 text-3xl font-bold">{{ title }}</h1>
    </header>
    <main class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <el-card
        v-for="item in data"
        :key="item.id"
        :class="[
          `flex
        container
        justify-start
        p-5
        hover:shadow-lg
        rounded-2xl`,
          item.id === 0
            ? 'flex-col justify-center items-center hover:bg-gray-100 cursor-pointer'
            : '',
        ]"
      >
        <p class="text-2xl font-semibold mb-5">{{ item.title }}</p>
        <p v-show="item.id !== 0" class="text-sm text-gray-500 mb-5">
          {{ item.description }}
        </p>
        <div v-show="item.id != 0">
          <el-button type="default" class="text-sm rounded-lg">打开</el-button>
          <el-button type="default" class="text-sm rounded-lg">编辑</el-button>
          <el-button type="danger" class="text-sm rounded-lg">删除</el-button>
        </div>
      </el-card>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const title = "题库";

// 模拟数据
const data = ref([
  {
    id: 0,
    title: "创建题库",
    description: "创建题库",
  },
  {
    id: 1,
    title: "前端",
    description: "前端题库",
  },
  {
    id: 2,
    title: "后端",
    description: "后端题库",
  },
  {
    id: 3,
    title: "数据库",
    description: "数据库题库",
  },
  {
    id: 4,
    title: "计算机基础",
    description: "计算机基础题库",
  },
]);
</script>

<style scoped></style>
