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
        @click="documentClickEvent(knowledge.title)"
      ></DocumentInfo>
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentInfo from "@/components/DocumentInfo.vue";

import { useMessageListStore } from "@/stores/messageList";

import { getGPTResponse } from "@/api/gpt";

import { useAnswertore } from "@/stores/answer";

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

const questionList = [
  { id: 1, question: "简述一下你对 HTML 语义化的理解？" },
  { id: 2, question: "HTML5 为什么只需要写 <!DOCTYPE HTML>？" },
  { id: 3, question: "行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？" },
  { id: 4, question: "页面导入样式时，使用 link 和 @import 有什么区别？" },
  {
    id: 5,
    question:
      "如何创建块级格式化上下文(block formatting context)，BFC 有什么用？",
  },
  { id: 6, question: "CSS 如何实现垂直居中？" },
  {
    id: 7,
    question: "CSS 选择器有哪些？哪些属性可以继承？优先级算法如何计算？",
  },
  { id: 8, question: "CSS3 新增伪类有那些？" },
  { id: 9, question: "如何居中一个浮动元素？" },
  { id: 10, question: "display 有哪些值？说明他们的作用。" },
  { id: 11, question: "position 的值 relative 和 absolute 定位原点是？" },
  { id: 12, question: "CSS3 有哪些新增的特性？" },
  { id: 13, question: "请解释一下 CSS3 的 flex 弹性盒模型。" },
  { id: 14, question: "请解释一下 CSS3 的 grid 网格布局。" },
  { id: 15, question: "请解释一下 CSS3 的动画。" },
  { id: 16, question: "请解释一下 CSS3 的过渡。" },
  { id: 17, question: "请解释一下 CSS3 的变形。" },
  { id: 18, question: "请解释一下 CSS3 的滤镜。" },
  { id: 19, question: "请解释一下 CSS3 的多列布局。" },
  { id: 20, question: "请解释一下 CSS3 的媒体查询。" },
  { id: 21, question: "请解释一下 CSS3 的选择器。" },
];

const documentClickEvent = (name: string) => {
  // 显示每个知识的题目列表
  console.log(name);
  if (name == "前端") {
    // 随机出题
    const num = Math.floor(Math.random() * questionList.length);
    const question = questionList[num].question;
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
    getGPTResponse(prompt_question)
      .then((response) => {
        console.log("GPT Answer:", response);
        // 获取到gpt的回复
        // 存储gpt的回复
        answerStore.setRightAnswer(response);
        store.addInterviewMessage(question);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
</script>

<style scoped></style>
