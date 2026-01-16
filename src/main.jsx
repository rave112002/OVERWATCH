import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { App as AntApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#004aad",
            // colorPrimaryHover: "#3fa65e",
            // colorPrimaryActive: "#267a44",
            // colorBorder: "#d1d5db",
            // colorBgContainer: "#f3f4f6",
            borderRadius: 8,
            fontFamily: "Poppins, sans-serif",
          },
          components: {
            Menu: {
              colorBgContainer: "#ffffff",
              itemSelectedBg: "rgba(0, 74, 173, 0.5)",
              itemSelectedColor: "#ffffff",
              itemMarginInline: 5,
              // collapsedWidth: 10,
            },
            Radio: {
              colorPrimary: "rgb(0, 74, 173, 0.3)",
            },
          },
        }}
      >
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
