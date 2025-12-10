import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// 创建axios实例
const request: AxiosInstance = axios.create({
  // 基础URL配置，可以根据环境变量配置
  baseURL: "/api",
  // 请求超时时间
  timeout: 10000,
  // 请求头配置
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 可以在这里添加loading状态
    console.log("Request started:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    console.log("Response received:", response.config?.url, data);

    // 根据后端约定的数据格式进行处理
    // 例如，如果后端返回的数据格式为 { code: number, data: any, message: string }
    if (data.code !== undefined) {
      if (data.code === 0 || data.code === 200) {
        return data.data;
      } else {
        // 处理业务错误
        console.error("Business error:", data.message || "Request failed");
        // 可以在这里添加错误提示，如使用antd的message组件
        // message.error(data.message || 'Request failed');
        return Promise.reject(new Error(data.message || "Request failed"));
      }
    }

    // 如果后端没有统一的响应格式，则直接返回数据
    return data;
  },
  (error: AxiosError) => {
    console.error("Network error:", error);

    // 处理网络错误
    let errorMessage = "Network error";

    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          errorMessage = "Unauthorized, please login again";
          // 可以在这里处理登录过期逻辑
          // 例如清除token并跳转到登录页
          localStorage.removeItem("token");
          break;
        case 403:
          errorMessage = "Access denied";
          break;
        case 404:
          errorMessage = "Request resource not found";
          break;
        case 500:
          errorMessage = "Internal server error";
          break;
        default:
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = "No response received from server";
    } else {
      // 请求配置出错
      errorMessage = error.message || "Request failed";
    }

    // 可以在这里添加错误提示
    // message.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// 导出axios实例，以便在需要时使用原始axios功能
export default request;
