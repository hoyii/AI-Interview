import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { apiKey, apiUrl } from "@/config/config";

const key = apiKey;
const url = apiUrl;

export const models: { [key: string]: string } = {
  讯飞星火大模型: "gpt-4o-mini",
  "GPT-4o mini": "gpt-4o-mini",
  "GPT-4o": "gpt-4o",
  "GPT-3.5 turbo": "gpt-3.5-turbo",
};

export const useModelStore = defineStore("model", () => {
  // 初始化从 localStorage 获取值
  const model = ref(localStorage.getItem("model") || "");
  const apiUrl = ref(url);
  const apiKey = ref(key);

  // 计算属性
  const getModel = computed(() => model.value);
  const getApiUrl = computed(() => apiUrl.value);
  const getApiKey = computed(() => apiKey.value);

  // 修改方法
  const setModel = (newModel: string) => {
    model.value = newModel;
    localStorage.setItem("model", newModel);
  };

  const setApiUrl = (url: string) => {
    apiUrl.value = url;
    localStorage.setItem("apiUrl", url);
  };

  const setApiKey = (key: string) => {
    apiKey.value = key;
    localStorage.setItem("apiKey", key);
  };

  return {
    getModel,
    setModel,
    getApiUrl,
    setApiUrl,
    getApiKey,
    setApiKey,
  };
});
