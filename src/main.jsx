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

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js");
// }

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
            fontFamily: "Satoshi, sans-serif",
          },
          components: {
            Menu: {
              colorBgContainer: "transparent",
              itemColor: "#ffffff",
              horizontalItemSelectedColor: "#60A5FA",
              horizontalItemHoverColor: "#60A5FA",

              // submenu popup (dropdown)
              popupBg: "#0b1220", // background of the dropdown panel
              subMenuItemBg: "#0b1220", // background behind submenu items
              itemHoverBg: "rgba(96,165,250,0.12)",
              itemSelectedBg: "rgba(96,165,250,0.20)",
              itemHoverColor: "#60A5FA",
              itemSelectedColor: "#60A5FA",
            },
            Radio: {
              buttonBg: "transparent",
              buttonColor: "#ffffff",
            },
          },
        }}
      >
        <AntApp>
          <App />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
