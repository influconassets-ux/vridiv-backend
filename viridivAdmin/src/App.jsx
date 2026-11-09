import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import AddOffer from "./pages/addOffer/AddOffer";
import Orders from "./pages/orders/Orders";
import SingleOrder from "./pages/singleOrder/SingleOrder";
import PendingUsers from "./pages/pendingUsers/PendingUsers";
import AuthLayout from "./layout/authLayout/AuthLayout";
import LoginMain from "./components/loginMain/LoginMain";
import ChangePassword from "./components/changePassword/ChangePassword";
import NewOrders from "./pages/newOrders/NewOrders";
import UsersMain from "./pages/usersMain/UsersMain";
import DownloadData from "./pages/downloadData/DownloadData";
import AddAdmin from "./pages/addAdmin/AddAdmin";
import AdminAccounts from "./pages/adminAccounts/AdminAccounts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/add-offerlist", element: <AddOffer /> },
      { path: "/orders", element: <NewOrders /> },
      { path: "/order/:invoiceId", element: <SingleOrder /> },
      { path: "/verifications", element: <UsersMain /> },
      { path: "/data", element: <DownloadData /> },
      { path: "/create-admin-account", element: <AddAdmin /> },
      { path: "/admin-accounts", element: <AdminAccounts /> },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginMain /> }],
  },
  {
    path: "/change-password",
    element: <AuthLayout />,
    children: [{ path: "/change-password", element: <ChangePassword /> }],
  },
]);

function App() {
  return (
    <div className="AppContainer">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Optional: 'light' | 'dark' | 'colored'
      />
    </div>
  );
}

export default App;
