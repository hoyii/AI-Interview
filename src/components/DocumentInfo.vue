<template>
  <div
    v-loading="props.isLoading"
    class="container relative flex flex-none items-center p-2 rounded-lg shadow-lg bg-white h-20 w-1/3 min-w-36"
  >
    <img src="/book.svg" alt="PDF icon" class="w-8 mr-2" />
    <div class="flex flex-col mr-auto">
      <span class="span-1 font-bold">{{ props.fileName }}</span>
    </div>
    <button
      @click="handleFileDelete(props.fileIndex as number)"
      class="absolute top-0 right-0"
    >
      <IconoirProvider
        :icon-props="{
          color: '#ff0000',
          'stroke-width': 2,
          width: '1em',
          height: '1em',
        }"
      >
        <XmarkCircle />
      </IconoirProvider>
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconoirProvider, XmarkCircle } from "@iconoir/vue";
import { useDocumentListStore } from "@/stores/documentList";
const props = defineProps({
  isLoading: Boolean,
  fileIndex: Number,
  fileName: String,
});

// 删除文档
const handleFileDelete = (fileIndex: number) => {
  useDocumentListStore().deleteDocument(fileIndex);
};
</script>

<style lang="less" scoped>
.container {
  font-family:
    "PingFang SC",
    "Microsoft YaHei",
    SimHei,
    -apple-system,
    blinkmacsystemfont,
    "Helvetica Neue",
    helvetica,
    "segoe ui",
    arial,
    roboto,
    "PingFang SC",
    miui,
    "Hiragino Sans GB",
    "Microsoft Yahei",
    sans-serif;
}

.span-2 {
  font-family: consolas, monospace;
}
</style>
