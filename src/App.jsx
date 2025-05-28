import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminRouter from "./routes/AdminRouter";
import UserRouter from "./routes/UserRouter";
import NotFound from "./pages/NotFound/NotFound";
import Forbidden from "./pages/NotFound/Forbidden";
import ServerError from "./pages/NotFound/ServerError";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollRestoration from "./components/ScrollRestoration";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

// Khởi tạo client
const queryClient = new QueryClient();

const sessionStoragePersistor = createSyncStoragePersister({
  storage: window.sessionStorage, // <== đổi từ localStorage sang sessionStorage
  key: "react-query-user-cache", // Tùy chọn: đặt key rõ ràng để dễ kiểm soát
});
console.log(sessionStoragePersistor);

persistQueryClient({
  queryClient,
  persister: sessionStoragePersistor,
  maxAge: 1000 * 60 * 60, // Ví dụ: cache tồn tại 1 giờ trong session
});
function App() {
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollRestoration />
          <Routes>
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/*" element={<UserRouter />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="/500" element={<ServerError />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
