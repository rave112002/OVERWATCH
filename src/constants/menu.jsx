import {
  AppstoreOutlined,
  CloudOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

export const MODULES = [
  {
    type: "item",
    icon: <AppstoreOutlined />,
    value: "dashboard",
    label: "Dashboard",
    link: "/admin/dashboard",
    // element: <Home />,
  },
  {
    type: "item",
    icon: <AppstoreOutlined />,
    value: "second-page",
    label: "Second Page",
    link: "/admin/second-page",
    // element: <SecondPage />,
  },
  //   {
  //     type: "group",
  //     icon: <GlobalOutlined />,
  //     value: "maps",
  //     label: "Maps",
  //     children: [
  //       {
  //         value: "map1",
  //         label: "Map",
  //         icon: <GlobalOutlined />,
  //         link: "/admin/maps/map1",
  //         element: <Map />,
  //       },
  //       {
  //         value: "mapv2",
  //         label: "Mapv2",
  //         icon: <GlobalOutlined />,
  //         link: "/admin/maps/mapv2",
  //         element: <Mapv2 />,
  //       },
  //       {
  //         value: "weather",
  //         label: "Weather",
  //         icon: <CloudOutlined />,
  //         link: "/admin/maps/weather",
  //         element: <Weather />,
  //       },
  //     ],
  //   },
];
