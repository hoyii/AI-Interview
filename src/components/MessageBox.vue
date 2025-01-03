<!-- 封装单个消息框的样式 -->
<template>
  <div v-if="props.role === 'gpt'" class="flex justify-start">
    <div>
      <el-card shadow="hover" class="card rounded-3xl max-w-fit">
        <div v-html="renderMarkdown(props.content)" class="render" />
      </el-card>
      <div class="flex justify-start">
        <el-button
          class="rounded-xl mt-1"
          @click="tipsClickEvent"
          :disabled="!rightAnswer"
          >提示</el-button
        >
        <el-button
          class="rounded-xl mt-1"
          @click="gradeClickEvent"
          :disabled="!rightAnswer"
          >一键评分</el-button
        >
      </div>
    </div>
  </div>
  <div v-else class="flex justify-end">
    <el-card shadow="hover" class="back-color card rounded-3xl">
      <div v-html="renderMarkdown(props.content)" class="render" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElNotification } from "element-plus";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

import { useAnswertore } from "@/stores/answer";
import { computed } from "vue";
import { useMessageListStore } from "@/stores/messageList";

const props = defineProps<{
  role: string;
  content: string;
}>();

// 高亮代码
const highlightCode = (str: string, lang: string): string => {
  const language = hljs.getLanguage(lang);
  if (language) {
    try {
      return (
        '<pre class="hljs"><code>' +
        hljs.highlight(lang, str, true).value +
        "</code></pre>"
      );
    } catch (error) {
      console.error(error);
    }
  }
  // 如果未指定语言或无法识别语言，则使用默认的逃逸 HTML 处理
  return (
    '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
  );
};

const md = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightCode,
});

const renderMarkdown = (text: string) => {
  return md.render(text);
};

const answerStore = useAnswertore();

const rightAnswer = computed(() => answerStore.getRightAnswer);

const messageListStore = useMessageListStore();

// 提示按钮点击事件
const tipsClickEvent = () => {
  const prompt = `假设你是一个温柔幽默的前端工程师面试官，你需要根据你手上的题目和答案向用户给出提示，引导用户回答出正确的答案。提示尽量简洁！！注意不能透露答案的内容！！
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  题目：${props.content}
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  答案：${rightAnswer}
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  `;
  ElNotification.info({
    message: "正在获取提示",
    duration: 2000,
  });
  messageListStore.addUserMessage_copy(
    {
      role: "user",
      content: "我觉得我需要点提示",
    },
    prompt
  );
};

const gradeClickEvent = () => {
  // 获取对话内容 将对话内容内的gpt 替换成 面试官，user 替换成 面试者
  console.log(messageListStore.state.messageList);
  const newMessageList = [];
  for (let i = 0; i < messageListStore.state.messageList.length; i++) {
    const message = messageListStore.state.messageList[i];
    if (message.role === "gpt") {
      newMessageList.push({
        role: "面试官",
        content: message.content,
      });
    } else if (message.role === "user") {
      newMessageList.push({
        role: "面试者",
        content: message.content,
      });
    }
  }
  const prompt = `假设你是一个温柔的资深前端评分专家，你擅长评价面试者的表现，你需要根据下列面试官和面试者的对话，给面试者一个合理的评价和评分，评价和评分必须客观！！

  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  评分标准：
  1. 评分范围为0-100分，满分100分。
  2. 评分标准为：0-60分为不合格，60-80分为合格，80-90分为良好，90-100分为优秀。

  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  面试官与面试者对话内容：
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  ${newMessageList
    .map((item) => {
      return `${item.role}：${item.content}`;
    })
    .join("\n")}  

  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  请给出你的评价和评分：
  `;
  messageListStore.addUserMessage_copy(
    {
      role: "user",
      content: "我的表现如何？",
    },
    prompt
  );
  console.log(prompt);
  ElNotification.success({
    message: "正在评分",
    duration: 2000,
  });
};
</script>

<style lang="less" scoped>
@import "@/styles/markdown-styles-light.less";
.back-color {
  background-color: #f4f4f4;
}
:deep(.card) .el-card__body {
  padding: 10px !important;
}
</style>
