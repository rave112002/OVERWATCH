import { Routes, Route } from "react-router-dom";
import LandingLayout from "@pages/layouts/LandingLayout";
// import Login from "@pages/Login";
import { ADMIN_MODULES } from "@constants/menu";
import Public from "@pages/Public";

const NotFound = () => (
  <div className="h-dvh bg-header flex flex-col items-center justify-center">
    <span className="text-5xl font-bold text-white text-shadow-lg/30">
      404 - Page Not Found
    </span>
    <p className="text-white mt-2">Return to home using the menu.</p>
  </div>
);

const extractRoutes = (modules) => {
  let routes = [];
  modules.forEach((module) => {
    if (module.type === "item" && module.link && module.element) {
      routes.push({ path: module.link, element: module.element });
    }
    if (module.type === "group" && Array.isArray(module.children)) {
      module.children.forEach((child) => {
        if (child.link && child.element) {
          routes.push({ path: child.link, element: child.element });
        }
      });
    }
  });
  return routes;
};

const routes = extractRoutes(ADMIN_MODULES);

const Routers = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Public />} /> */}

      {/* Default route */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Public />} />
      </Route>

      {/* Admin route inside layout */}
      <Route element={<LandingLayout admin={true} />}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>

      {/* Catch-all 404 with redirect */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
