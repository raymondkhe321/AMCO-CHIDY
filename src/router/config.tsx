import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Home = lazy(() => import("../pages/home/page"));
const Products = lazy(() => import("../pages/products/page"));
const ProductDetail = lazy(() => import("../pages/product-detail/page"));
const Cart = lazy(() => import("../pages/cart/page"));
const Checkout = lazy(() => import("../pages/checkout/page"));
const OrderSuccess = lazy(() => import("../pages/order-success/page"));
const Login = lazy(() => import("../pages/login/page"));
const AdminDashboard = lazy(() => import("../pages/admin/page"));
const NotFound = lazy(() => import("../pages/NotFound"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/product/:id",
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/order-success",
    element: <OrderSuccess />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
