<template>
  <div class="p-10 gap-10 w-full h-full overflow-y-auto">
    <header>
      <h1 class="mb-10 text-3xl font-bold">{{ title }}</h1>
    </header>
    <main class="flex flex-col gap-6">
      <div>
        <input
          ref="fileInput"
          type="file"
          accept=".txt"
          style="display: none"
          @change="handleFileUpload"
        />
        <el-button type="primary" @click="handleCreate">导入题库</el-button>
      </div>
      <el-table
        :data="filterTableData"
        style="width: 100%"
        max-height="500"
        class="font-bold"
      >
        <el-table-column label="题目" prop="name">
          <template #default="{ row }">
            <p class="font-bold">{{ row.questionName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tag">
          <template #default="{ row }">
            <div class="flex flex-col max-w-fit">
              <el-tag
                v-for="(tag, index) in row.questionTag"
                :key="index"
                :type="getTagType(index)"
                class="mb-1"
              >
                <!-- 如果tag 是空不显示 -->
                {{ tag }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="uploadTime">
          <template #default="{ row }">
            <p class="font-bold">
              {{ formatTimestamp(row.questionUploadTime) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="访问时间" prop="askTime">
          <template #default="{ row }">
            <p class="font-bold">
              {{ formatTimestamp(row.questionLastAskTime) }}
            </p>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" placeholder="搜索" />
          </template>
          <template #default="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)">
              进入
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElTable } from "element-plus";
import { useRoute } from "vue-router";
import { getAllQuestion, addQuestion } from "@/api/question";

const knowledgeId = useRoute().params.knowledgeId as string;

const requestParams = {
  knowledgeId: knowledgeId,
};

onMounted(() => {
  // 发送获取全部题目的请求
  console.log(knowledgeId);
  getAllQuestion(requestParams)
    .then((res) => {
      tableData.value = res.result.questionList;
    })
    .catch((err) => {
      console.log(err);
    });
});

const title = ref("前端");

interface Question {
  questionId: number;
  questionName: string;
  questionTag: string[];
  questionUploadTime: number;
  questionLastAskTime: number;
}

const search = ref("");
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      !search.value ||
      data.questionName.toLowerCase().includes(search.value.toLowerCase())
  )
);
const handleEdit = (index: number, row: Question) => {
  console.log(index, row);
};
const handleDelete = (index: number, row: Question) => {
  console.log(index, row);
};

const fileInput = ref<HTMLInputElement | null>(null);

const handleCreate = () => {
  // 选择上传文件
  fileInput.value!.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files; // 获取用户选择的文件
  if (files) {
    console.log(files);
    const file = files[0]; // 获取第一个文件
    const reader = new FileReader(); // 创建文件读取对象
    reader.readAsText(file); // 读取文件内容
    reader.onload = () => {
      // 读取完成后的回调
      // 每隔一行分割 将结果存储到数组中 空字符串不加入数组
      const lines = reader.result
        ?.toString()
        .split("\r\n")
        .filter((value) => {
          return value.trim() !== "";
        });
      addQuestion({
        knowledgeId: knowledgeId,
        questionList: lines?.map((value) => {
          return { questionName: value };
        }) as any,
      }).then((res) => {
        console.log(res);
        tableData.value = res.result.questionList;
      });
    };

    // 清空缓存
    target.value = "";
  }
};

const tableData = ref<Question[]>([]);

const getTagType = (index: number) => {
  // 根据索引返回不同的类型
  const colors = ["success", "info", "warning", "danger", "primary"];
  return colors[index % colors.length];
};

function formatTimestamp(timestamp: number) {
  if (!timestamp) return "-"; // 如果时间戳为空，返回一个占位符
  const date = new Date(timestamp * 1000); // 转换为毫秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需+1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped></style>
