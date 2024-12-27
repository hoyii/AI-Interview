<!-- 这个组件用于展示文件列表 -->
<template>
  <div
    v-if="knowledgeList.length !== 0"
    class="bg-[#f4f4f4] rounded-2xl w-1/2 p-2"
  >
    <div class="flex overflow-x-auto p-2 space-x-4">
      <DocumentInfo
        v-for="(knowledge, index) in knowledgeList"
        :key="knowledge.id"
        :is-loading="false"
        :file-index="index"
        :file-name="knowledge.title"
        :file-size="1"
        class="hover:bg-gray-100"
      ></DocumentInfo>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentInfo from "@/components/DocumentInfo.vue";

import { useMessageListStore } from "@/stores/messageList";

import { getGPTResponse } from "@/api/gpt";

import { useAnswertore } from "@/stores/answer";

import { ElNotification } from "element-plus";
import { onMounted, onUnmounted } from "vue";

import { useRoute } from "vue-router";

import { getQuestionDetail } from "@/api/question";

const questionId = useRoute().params.questionId as string;

const requestParams = {
  questionId: questionId,
};

onMounted(() => {
  getQuestionDetail(requestParams).then((response) => {
    const question = response.result.questionName;
    // 先发送题目给gpt，获取gpt关于题目的回答
    const prompt = `背景：假设你是一名资深专业${name}工程师，你需要回答下面的问题。
    要求：
    1.你的回答要简明扼要。
    2.需要分点陈述。
    3.字数不能超过100个词。
    输出示例：
    1. 压缩资源：使用 gzip 或 brotli 压缩 CSS、JS 和图片等资源。
    2. 懒加载：对图片、视频和非关键内容实现懒加载。
    3. 缓存利用：合理配置缓存策略，减少重复请求。
    4. 异步加载：将 JavaScript 脚本设置为异步加载（async 或 defer）。
    5. CDN加速：使用内容分发网络（CDN）提高静态资源加载速度。
    问题：${question}。
    请参照上述的格式，不需要任何冗余信息，输出你的答案：`;
    const prompt_question = prompt + question;
    store.addInterviewMessage(question);
    answerStore.setRightAnswer("");
    ElNotification.info({
      message: "正在获取正确答案，请稍等",
      duration: 2000,
    });
    getGPTResponse(prompt_question)
      .then((response) => {
        console.log("GPT Answer:", response);
        // 获取到gpt的回复
        // 存储gpt的回复
        answerStore.setRightAnswer(response);
        ElNotification.success({
          message: "获取正确答案成功",
          duration: 2000,
        });
        setTimeout(() => {
          ElNotification.info({
            message: "请输入你的回答",
            duration: 2000,
          });
        }, 500);
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

onUnmounted(() => {
  store.state.messageList = [];
});

const store = useMessageListStore();

const answerStore = useAnswertore();

const knowledgeList = [
  {
    id: 1,
    title: "前端",
  },
  {
    id: 2,
    title: "后端",
  },
  {
    id: 3,
    title: "数据库",
  },
  {
    id: 4,
    title: "运维",
  },
];
</script>

<style scoped></style>
