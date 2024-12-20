import { defineStore } from "pinia";
import { reactive, computed } from "vue";

export const useAnswertore = defineStore("right_answer", () => {
  const state = reactive({
    right_answer: "",
    user_answer: "",
  });

  const getRightAnswer = computed(() => state.right_answer);
  const getUserAnswer = computed(() => state.user_answer);
  function setRightAnswer(right_answer: string) {
    state.right_answer = right_answer;
  }
  function setUserAnswer(user_answer: string) {
    state.user_answer = user_answer;
  }

  return {
    state,
    setRightAnswer,
    getRightAnswer,
    setUserAnswer,
    getUserAnswer,
  };
});
