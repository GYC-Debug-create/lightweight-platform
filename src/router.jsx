import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import MinePage from "./pages/MinePage";
import DetailPage from "./pages/DetailPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import PayPage from "./pages/PayPage";
import OrderListPage from "./pages/OrderListPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import AdminLoginPage from "./admin/AdminLoginPage";
import AdminProductPage from "./admin/AdminProductPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: "category", Component: CategoryPage },
      { path: "cart", Component: CartPage },
      { path: "mine", Component: MinePage },
      { path: "login", Component: LoginPage },
      { path: "detail/:id", Component: DetailPage },
      { path: "order/create", Component: CreateOrderPage },
      { path: "pay/:orderId", Component: PayPage },
      { path: "orders", Component: OrderListPage },
      { path: "order/:orderId", Component: OrderDetailPage },
      { path: "admin/login", Component: AdminLoginPage },
      { path: "admin/products", Component: AdminProductPage },
    ],
  },
]);

export default router;
