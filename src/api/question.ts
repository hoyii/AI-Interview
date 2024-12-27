import axios from "axios";
import { serverUrl } from "@/config/config";

const apiClient = axios.create({
  baseURL: serverUrl,
  headers: {
    // 不需要手动设置 Content-Type，axios 会自动设置为 multipart/form-data
  },
});

interface AllQuestionResponse {
  status: string; // 表示请求的状态，例如 "success" 或 "failure"
  result: {
    knowledgeId: number; // 知识点的 ID
    knowledgeName: string; // 知识点名称
    knowledgeDesc: string; // 知识点描述
    questionList: Array<{
      questionId: number; // 问题 ID
      questionName: string; // 问题名称
      questionTag: string[]; // 问题标签，列表类型
      questionUploadTime: number; // 问题上传时间，Unix 时间戳
      questionLastAskTime: number; // 问题上次提问时间，Unix 时间戳
    }>;
  };
}

interface AllQuestionRequest {
  knowledgeId: string;
}

// 获取知识下的所有问题
export const getAllQuestion = async (
  data: AllQuestionRequest
): Promise<AllQuestionResponse> => {
  // 用get和query的方式发送请求
  try {
    const response = await apiClient.get<AllQuestionResponse>("/question/all", {
      params: {
        knowledgeId: data.knowledgeId,
      },
    });

    if (response.data.status !== "success") {
      throw new Error("Get all question failed");
    }

    return response.data;
  } catch (error) {
    throw new Error("Get all question failed");
  }
};

// 上传问题列表
interface AddQuestionResponse {
  status: string;
  result: {
    knowledgeId: number;
    questionList: Array<{
      questionId: number;
      questionName: string;
      questionTag: string[];
      questionUploadTime: number;
      questionLastAskTime: number;
    }>;
  };
}

interface AddQuestionRequest {
  knowledgeId: string;
  questionList: Array<{
    questionName: string;
  }>;
}

// 添加问题
export const addQuestion = async (
  data: AddQuestionRequest
): Promise<AddQuestionResponse> => {
  try {
    const response = await apiClient.post<AddQuestionResponse>(
      "/question/add",
      {
        knowledgeId: data.knowledgeId,
        questionList: data.questionList,
      }
    );

    if (response.data.status !== "success") {
      throw new Error("Add question failed");
    }

    return response.data;
  } catch (error) {
    throw new Error("Add question failed");
  }
};

interface QuestionDetailResponse {
  status: string;
  result: {
    questionId: number;
    questionName: string;
    questionTag: string[];
    questionUploadTime: number;
    questionLastAskTime: number;
    knowledgeId: number;
  };
}

interface QuestionDetailRequest {
  questionId: string;
}

// 根据questionId 获取问题详情
export const getQuestionDetail = async (
  data: QuestionDetailRequest
): Promise<QuestionDetailResponse> => {
  try {
    const response = await apiClient.get<QuestionDetailResponse>(
      "/question/get",
      {
        params: {
          questionId: data.questionId,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error("Get question detail failed");
    }

    return response.data;
  } catch (error) {
    throw new Error("Get question detail failed");
  }
};
