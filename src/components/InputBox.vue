<!-- 这是一个输入框 -->
<template>
  <div class="bg-color flex p-4 space-x-2 rounded-2xl w-1/2 items-end">
    <FileUploader />
    <el-input
      id="input_1"
      class="textarea"
      type="textarea"
      v-model="input"
      :autosize="{ minRows: 1, maxRows: 8 }"
      placeholder="请输入你的回答"
      resize="none"
      @keydown.enter.prevent="handleButtonClick"
    ></el-input>
    <div>
      <el-button :disabled="!input" @click="handleButtonClick">
        <IconoirProvider
          :icon-props="{
            color: '#000000',
            'stroke-width': 1,
            width: '2em',
            height: '2em',
          }"
        >
          <SendSolid />
        </IconoirProvider>
      </el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@focus-border-color: #000000;

.el-button {
  background-color: #f4f4f4;
  --el-button-hover-border-color: #f4f4f4;
  --el-button-border-color: #f4f4f4;
  --el-button-disabled-border-color: #f4f4f4;
  --el-button-disabled-bg-color: none;
  --el-button-active-border-color: #f4f4f4;
}

.bg-color {
  background-color: #f4f4f4;
}

.el-textarea {
  font-family:
    ui-sans-serif,
    -apple-system,
    system-ui,
    Segoe UI,
    Roboto,
    Ubuntu,
    Cantarell,
    Noto Sans,
    sans-serif,
    Helvetica,
    Apple Color Emoji,
    Arial,
    Segoe UI Emoji,
    Segoe UI Symbol;
  font-size: 1rem;
  --el-input-focus-border-color: none;
  --el-input-bg-color: none;
  --el-input-border-color: none;
  --el-input-hover-border-color: none;
}
</style>

<script setup lang="ts">
import { IconoirProvider, SendSolid } from "@iconoir/vue";

import { ref, nextTick } from "vue";

import { useMessageListStore } from "@/stores/messageList";

import { useAnswertore } from "@/stores/answer";

import { ElNotification } from "element-plus";

import FileUploader from "./DocumentUploader.vue";

const input = ref("");

const answerStore = useAnswertore();

// 在这里处理按钮点击事件 向gpt发送问题
const handleButtonClick = (e: KeyboardEvent) => {
  // 显示进度条
  ElNotification.info({
    message: "正在比对答案，请稍等",
    duration: 2000,
  });
  if (e.key === "Enter" && e.shiftKey) {
    input.value += "\n";
    const textarea = document.getElementById("input_1");
    nextTick(() => {
      if (!textarea) return;
      textarea.scrollTop = textarea.scrollHeight;
    });
    return;
  }
  if (!input.value) {
    return;
  }
  const question = input.value;
  input.value = "";
  const messageList = useMessageListStore();

  const prompt_question = `背景：假设你是一名资深专业前端面试官，你的语气温柔且幽默，现在你手上有正确答案和我的回答。
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  正确答案：${answerStore.getRightAnswer}。
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  我的回答：${question}。
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  要求：
  1. 你需要根据正确答案的内容，对比指出我的回答的错误之处。
  2. 对于我的回答的错误之处，你需要分点陈述。
  3. 如果我的回答基本正确，可以简单回复“回答正确”。
  现在，按照以上要求对我的回答进行指正：`;
  messageList.addUserMessage_copy(
    {
      role: "user",
      content: question,
    },
    prompt_question
  );
  // messageList.addUserMessage({
  //   role: "user",
  //   content: question,
  // });
};
</script>
