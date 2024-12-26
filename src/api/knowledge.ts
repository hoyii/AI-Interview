import axios from "axios";
import { serverUrl } from "@/config/config";

const apiClient = axios.create({
  baseURL: serverUrl,
  headers: {
    // 不需要手动设置 Content-Type，axios 会自动设置为 multipart/form-data
  },
});

interface allKnowledgeResponse {
  status: string;
  result: {
    knowledgeList: [
      {
        knowledgeName: string;
        knowledgeDesc: string;
      },
    ];
  };
}

interface allKnowledgeRequest {
  username: string;
}

export const getAllKnowledge = async (
  data: allKnowledgeRequest
): Promise<allKnowledgeResponse> => {
  // 用get和query的方式发送请求
  try {
    const response = await apiClient.get<allKnowledgeResponse>(
      "/knowledge/all",
      {
        params: {
          username: data.username,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error("Get all knowledge failed");
    }

    return response.data;
  } catch (error) {
    throw new Error("Get all knowledge failed");
  }
};
