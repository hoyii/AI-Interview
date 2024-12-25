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
