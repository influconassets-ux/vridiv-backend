import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Layout from "./layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import BuyerLayout from "./layout/buyer/BuyerLayout";
import OfferList from "./components/dashboard/offerList/OfferList";
import OfferListSeller from "./components/sellerDash/offerListSeller/offerListSeller";
import OfferListAdmin from "./components/dashboard/offerListAdmin/OfferListAdmin";
import Orders from "./components/dashboard/orders/Orders";
import SingleOrder from "./components/dashboard/singleOrder/SingleOrder";
import Watchlist from "./components/dashboard/offerList/Watchlist";
import AuthLayout from "./layout/authLayout/AuthLayout";
import SignUpOptions from "./pages/signUpOptions/SignUpOptions";
import SignUpForm from "./pages/signUpForm/SignUpForm";
import SignUpSuccess from "./pages/signUpSuccess/SignUpSuccess";
import LoginMainPage from "./pages/LoginMainPage/LoginMainPage";
import OnBoard from "./pages/onBoard/OnBoard";
import SignUpWrapper from "./pages/signUpWrapper/SignUpWrapper";
import OfferListNew from "./components/dashboard/offerListNew/OfferListNew";
import OnBoardSuccess from "./pages/onBoardSuccess/OnBoardSuccess";
import WatchlistNew from "./components/dashboard/offerListNew/WatchlistNew";
import NewOrders from "./pages/newOrders/NewOrders";
import { AppContext } from "./context/AppContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "/", element: <Home /> }],
  },
  {
    path: "/buyer-dashboard",
    element: <BuyerLayout />,
    children: [
      { path: "/buyer-dashboard", element: <OfferListNew /> },
      { path: "/buyer-dashboard/orders", element: <NewOrders /> },
      { path: "/buyer-dashboard/order/:invoiceId", element: <SingleOrder /> },
      { path: "/buyer-dashboard/watchlist", element: <WatchlistNew /> },
    ],
  },
  {
    path: "/sign-up",
    element: <AuthLayout />,
    children: [
      { path: "/sign-up", element: <SignUpOptions /> },
      { path: "/sign-up/create-account", element: <SignUpWrapper /> },
      { path: "/sign-up/success", element: <SignUpSuccess /> },
    ],
  },
  {
    path: "/onboard",
    element: <AuthLayout />,
    children: [
      { path: "/onboard", element: <OnBoard /> },
      { path: "/onboard/success", element: <OnBoardSuccess /> },
    ],
  },
  {
    path: "/sign-in",
    element: <AuthLayout />,
    children: [{ path: "/sign-in", element: <LoginMainPage /> }],
  },
  {
    path: "/seller-dashboard",
    element: <BuyerLayout />,
    children: [
      { path: "/seller-dashboard", element: <OfferListSeller /> },
      { path: "/seller-dashboard/orders", element: <Orders /> },
      { path: "/seller-dashboard/order", element: <SingleOrder /> },
    ],
  },
]);

function App() {
  return (
    <div className="appContainer">
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
        theme="colored"
      />
    </div>
  );
}

export default App;