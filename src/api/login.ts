import axios from "axios";
import { serverUrl } from "@/config/config";

const apiClient = axios.create({
  baseURL: serverUrl,
  headers: {
    // 不需要手动设置 Content-Type，axios 会自动设置为 multipart/form-data
  },
});

interface LoginResponse {
  status: string;
  result: {
    username: string;
    token: string;
  };
}

interface LoginRequest {
  username: string;
  password: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    // 创建一个 FormData 实例，并将数据添加到其中
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    // 使用 FormData 发送 POST 请求
    const response = await apiClient.post<LoginResponse>("/login", formData, {
      headers: {
        // 不需要手动设置 Content-Type，因为 FormData 会自动设置
      },
    });

    if (response.data.status !== "success") {
      throw new Error("Login failed");
    }

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};
