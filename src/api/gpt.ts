import axios from "@/plugins/axios";

import { parsePack } from "@/utils/parsePack";

import { apiKey, apiUrl } from "@/config/config.ts";

export const getAnswer = async (question: string) => {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAnswerStream = async (
  question: string,
  model: string,
  apiUrl: string,
  apiKey: string
) => {
  const url = apiUrl;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        stream: true,
      }),
    });
    if (!res.body) {
      throw new Error("Network response was not ok");
    }
    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    return new ReadableStream({
      async start(controller) {
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              // console.log("done", done);
              controller.close();
              return;
            }
            const chunk = parsePack(
              decoder.decode(value, { stream: true })
            ) as any;
            // Get the data and send it to the browser via the controller
            controller.enqueue(chunk);
            // Check chunks by logging to the console
            push();
          });
        }
        push();
      },
    });
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
};

// 请求的函数
export async function getGPTResponse(prompt: string): Promise<string> {
  try {
    // 发送 POST 请求到 OpenAI API
    const response = await axios.post(
      apiUrl + "/chat/completions",
      {
        model: "gpt-4o-mini", // 或 'gpt-4'，根据你的模型选择
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // 获取返回的 GPT 答复
    const answer = response.data.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    throw new Error("Failed to get GPT response");
  }
}
