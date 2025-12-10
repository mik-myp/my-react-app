/*
 * @Descripttion: Do not edit
 * @Author: mayupeng
 * @Date: 2025-11-20 14:21:15
 * @LastEditors: mayupeng
 * @LastEditTime: 2025-11-20 14:40:41
 */
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@ant-design/v5-patch-for-react-19";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StyleProvider layer>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </StyleProvider>
);
