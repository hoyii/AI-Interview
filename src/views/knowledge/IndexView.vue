<template>
  <div class="p-10 gap-10 w-full h-full overflow-y-auto">
    <header>
      <h1 class="mb-10 text-3xl font-bold">{{ title }}</h1>
    </header>
    <main class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <el-card
        v-for="item in data"
        :key="item.knowledgeId"
        :class="[
          `flex
        container
        justify-start
        p-5
        h-48
        hover:shadow-lg
        rounded-2xl`,
          item.knowledgeId === -1
            ? 'flex-col justify-center items-center hover:bg-gray-100 cursor-pointer'
            : '',
        ]"
      >
        <p class="text-2xl font-semibold mb-5">{{ item.knowledgeName }}</p>
        <p v-show="item.knowledgeId !== -1" class="text-sm text-gray-500 mb-5">
          {{ item.knowledgeDesc }}
        </p>
        <div v-show="item.knowledgeId !== -1">
          <el-button
            type="default"
            class="text-sm rounded-lg"
            @click="openClickEvent(item.knowledgeId)"
            >打开</el-button
          >
          <el-button type="default" class="text-sm rounded-lg">编辑</el-button>
          <el-button type="danger" class="text-sm rounded-lg">删除</el-button>
        </div>
      </el-card>
    </main>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";
import { getAllKnowledge } from "@/api/knowledge";
import { useRoute } from "vue-router";

const title = "题库";

const data = ref<any[]>([
  {
    knowledgeId: -1,
    knowledgeName: "新建知识",
    knowledgeDesc: "新建知识",
  },
]);

const requestParams = {
  username: useRoute().params.username as string,
};

onMounted(() => {
  console.log(requestParams.username);
  // 获取用户全部知识
  getAllKnowledge(requestParams)
    .then((res) => {
      data.value = data.value.concat(res.result.knowledgeList);
      console.log(res.result.knowledgeList);
    })
    .catch((err) => {
      console.log(err);
    });
});

const openClickEvent = (knowledgeId: string) => {
  router.push(`/knowledge/${knowledgeId}`);
};
</script>

<style scoped></style>
