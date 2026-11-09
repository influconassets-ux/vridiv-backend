import axios from "axios";
import { createContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  // const currentBackendLink = `http://localhost:8000`;
  const currentBackendLink = `https://vridiv-backend-ele9.onrender.com`;

  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const [showLoginPage, setShowLoginPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [raisePriceCongText, setRaisePriceCongText] = useState(false);
  const [allOfferLists, setAllOfferLists] = useState([]);
  const [upcomingOfferLists, setUpcomingOfferLists] = useState([]);

  const [signupUserType, setSignupUserType] = useState(null);

  const [watchlist, setWatchlist] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  const [sidebarSelectedOfferList, setSidebarSelectedOfferList] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const handlePriceChange = (invoiceId, change) => {
    // console.log(sidebarSelectedOfferList);
    // console.log(invoiceId);
    setSidebarSelectedOfferList((prevOfferList) => ({
      ...prevOfferList,
      invoices: prevOfferList?.invoices?.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, currentPrice: invoice.currentPrice + change }
          : invoice
      ),
    }));

    setWatchlist((prevWatchlist) =>
      prevWatchlist.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, currentPrice: invoice.currentPrice + change }
          : invoice
      )
    );
  };

  const handlePriceChangeUsingInput = (invoiceId, change) => {
    setSidebarSelectedOfferList((prevOfferList) => ({
      ...prevOfferList,
      invoices: prevOfferList?.invoices?.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, currentPrice: change }
          : invoice
      ),
    }));

    setWatchlist((prevWatchlist) =>
      prevWatchlist.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, currentPrice: change }
          : invoice
      )
    );
  };

  const changeSideBarOfferList = (offerList) => {
    if (offerList) {
      setSidebarSelectedOfferList(offerList);
    } else {
      return;
    }
  };

  const fetchOfferLists = async (offerlistId = null, silent = false) => {
    if (!silent) setIsLoadingData(true);
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/offer-list/get-lists`,
        { withCredentials: true }
      );

      const result = response.data.offerLists;

      if (offerlistId) {
        changeSidebarForNewOffer(offerlistId, result);
      } else {
        if (!sidebarSelectedOfferList) {
          setSidebarSelectedOfferList(result[0]);
        } else {
          const updatedSelected = result.find(
            (offerList) => offerList._id === sidebarSelectedOfferList._id
          );
          if (updatedSelected) {
            setSidebarSelectedOfferList(updatedSelected);
          }
        }
      }

      setAllOfferLists(result);
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      if (!silent) setIsLoadingData(false);
    }
  };

  const fetchUpcomingOfferLists = async () => {
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/offer-list/get-upcoming-lists`,
        { withCredentials: true }
      );

      let result = response.data.offerLists;

      if (result?.length > 0) {
        result = result.map((offerList) => {
          const invoiceCount = offerList.invoices.length;

          const startingPrice = offerList.invoices.reduce((min, invoice) => {
            return invoice.price < min ? invoice.price : min;
          }, offerList.invoices[0].price);

          return {
            ...offerList,
            invoiceCount,
            startingPrice,
          };
        });
      }
      console.log("Upcoming");
      console.log(result);
      setUpcomingOfferLists(result);
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const addBid = async (invoiceIds, price) => {
    const userType = "buyer";

    try {
      // 1. OPTIMISTIC UPDATE
      setAllOfferLists((prev) =>
        prev.map((ol) => ({
          ...ol,
          invoices: ol.invoices.map((inv) =>
            invoiceIds.includes(inv._id)
              ? { ...inv, currentPrice: price, highestBidder: user._id }
              : inv
          ),
        }))
      );

      if (sidebarSelectedOfferList?.invoices) {
        setSidebarSelectedOfferList((prev) => ({
          ...prev,
          invoices: prev.invoices.map((inv) =>
            invoiceIds.includes(inv._id)
              ? { ...inv, currentPrice: price, highestBidder: user._id }
              : inv
          ),
        }));
      }

      setWatchlist((prev) =>
        prev.map((inv) =>
          invoiceIds.includes(inv._id)
            ? { ...inv, currentPrice: price, highestBidder: user._id }
            : inv
        )
      );

      toast.success("Offer Sent");
      setRaisePriceCongText(true);
      setTimeout(() => {
        setRaisePriceCongText(false);
      }, 3000);

      // 2. BACKEND CALL: In background
      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/add-bid`,
        {
          invoiceIds,
          userType,
          price,
          bidderId: user._id,
        }
      );

      // Sync with final server state
      if (response.data.success) {
        const result = response.data.offerLists;
        setAllOfferLists(result);
        if (sidebarSelectedOfferList?._id) {
          const updated = result.find(ol => ol._id === sidebarSelectedOfferList._id);
          if (updated) setSidebarSelectedOfferList(updated);
        }
      }
      return true;
    } catch (err) {
      console.error("Error adding bid:", err.response?.data || err.message);
      toast.error("Something Went Wrong");
      // Revert on error
      fetchOfferLists(null, true);
      return false;
    }
  };

  const removeraisePriceCongText = () => {
    setRaisePriceCongText(false);
  };

  const handleShowLoginPage = () => {
    setShowLoginPage((prev) => !prev);
  };

  const googleAuth = async (authCode) => {
    console.log("googleAuth sending request");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/google-login`,
        { code: authCode },
        { withCredentials: true }
      );

      // Extract data from response
      const { data } = response;
      console.log("Login Successful:", data);
      if (data.success) {
        setUser(data.user);

        return data;
      }
      return false;
    } catch (error) {
      console.error(
        "Google Authentication Failed:",
        error.response?.data || error.message
      );
      return error.response?.data || { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignup = async (authCode, userType) => {
    console.log("google signup sending request");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/google-sign-up`,
        { code: authCode, userType },
        { withCredentials: true }
      );

      // Extract data from response
      const { data } = response;

      console.log(data);
      return data;
    } catch (error) {
      console.error(
        "Google Authentication Failed:",
        error.response?.data || error.message
      );
      return error.response?.data || { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyToken = async () => {
    console.log("🔵 verifyToken called");
    setIsLoading(true);
    setIsVerifyingToken(true);
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/auth/verify-token`,
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (response.data.success) {
        console.log("Token verified");
        setUser(response.data.user); // Set the user if token is valid
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Token verification failed:",
        error.response?.data || error.message
      );
      setUser(null);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setIsVerifyingToken(false);
    }
  };

  const manualLogin = async (formData) => {
    try {
      console.log("handle Submit");
      const response = await axios.post(
        `${currentBackendLink}/api/auth/manual-login`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log("Token verified");
        setUser(response.data.user); // Set the user if token is valid
      } else {
        setUser(null);
      }
      console.log(response);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const onboarding = async (formData) => {
    try {
      const isUploadedFiles = formData.get("uploadedDocuments");
      let response;
      if (isUploadedFiles) {
        response = await axios.post(
          `${currentBackendLink}/api/auth/onboard-user-with-documents`,
          formData,
          {
            headers: {},
            withCredentials: true,
          }
        );
      } else {
        const jsonData = Object.fromEntries(formData.entries());
        response = await axios.post(
          `${currentBackendLink}/api/auth/onboard-user`,
          jsonData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      }

      const data = response.data;
      console.log(response);
      if (response.data.success) {
        setUser(data.user);
      } else {
        console.error("Onboarding failed:", data.message);
      }
      return response.data;
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      return error.response.data;
    }
  };

  const addToWatchlist = async (invoiceIds) => {
    try {
      // 1. OPTIMISTIC UPDATE
      // (Simplified: showing toast and updating local watchlist if possible)
      // Note: Full sync happens after backend call
      toast.success("Added to watchlist");

      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/add-watchlist`,
        { invoiceIds },
        { withCredentials: true }
      );

      if (response.data.success) {
        setWatchlist(response.data.watchlist);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error(error.response?.data?.message || "Something Went Wrong");
      return false;
    }
  };

  const removeFromWatchlist = async (invoiceIds) => {
    console.log(invoiceIds);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/delete-watchlist`,
        { invoiceIds }, // Sending invoiceIds as an array
        { withCredentials: true } // Ensure cookies/session are included
      );

      if (response.data.success) {
        console.log("Invoices deleted");
        setWatchlist(response.data.watchlist);
        return true;
        // Returning updated watchlist
      } else {
        console.error("Failed to add to watchlist:", response.data.message);
        return false;
      }
    } catch (error) {
      console.error(
        "Error adding to watchlist:",
        error.response?.data || error
      );
      return false;
    }
  };

  const getWatchlist = async () => {
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/offer-list/get-watchlist`,
        { withCredentials: true } // Ensuring session credentials are sent
      );

      if (response.data.success) {
        console.log("Fetched watchlist:", response.data.watchlist);
        setWatchlist(response.data.watchlist);
        return response.data.watchlist; // Returning fetched watchlist
      } else {
        console.error("Failed to fetch watchlist:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error.response?.data || error);
      return [];
    } finally {
    }
  };
  const getOrders = async () => {
    console.log("Fetching orders");
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/order/get-orders`,
        { withCredentials: true } // Ensuring session credentials are sent
      );

      if (response.data.success) {
        console.log("Fetched Orders:", response.data.orders);
        setUserOrders(response.data.orders);
        return response.data.orders; // Returning fetched watchlist
      } else {
        console.error("Failed to fetch watchlist:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error.response?.data || error);
      return [];
    } finally {
    }
  };

  const updateOrderAddress = async (
    orderIds,
    shippingAddress,
    billingAddress,
    isBillingAddressSameAsShipping,
    transporter,
    useForAllLots
  ) => {
    setShowLoader(true);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/order/update-address`,
        {
          orderIds,
          shippingAddress,
          billingAddress,
          isBillingAddressSameAsShipping,
          transporter,
          useForAllLots,
        },
        { withCredentials: true }
      );

      const result = response.data;
      if (result.success) {
        setUserOrders(result.orders);
        toast.success("Address Updated");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setShowLoader(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      // Optionally, clear user state or redirect to login page
      console.log("Logged out successfully");
      console.log(response);
      setUser(null);
      return true;
      // window.location.href = "/login"; // Redirect if needed
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      return true;
    }
  };
  const downloadOfferList = () => {
    if (!sidebarSelectedOfferList || !sidebarSelectedOfferList.invoices) {
      console.error("No offer list or invoices found.");
      return;
    }

    const offerListNumber = sidebarSelectedOfferList.offerListNumber;
    const invoices = sidebarSelectedOfferList.invoices;

    // Prepare data for Excel
    const dataToExport = invoices.map((invoice) => ({
      offerListNumber: offerListNumber,
      invoiceNumber: invoice.invoiceNumber,
      mark: invoice.mark,
      grade: invoice.grade,
      quantity: invoice.quantity,
      bags: invoice.bags,
      price: invoice.price,
    }));

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Offer List");

    // Generate and trigger download
    XLSX.writeFile(workbook, `${offerListNumber}_OfferList.xlsx`);
  };

  const acceptBid = async (invoiceIds) => {
    try {
      // 1. OPTIMISTIC UPDATE
      setAllOfferLists((prev) =>
        prev.map((ol) => ({
          ...ol,
          invoices: ol.invoices.map((inv) =>
            invoiceIds.includes(inv._id) ? { ...inv, status: "Ordered" } : inv
          ),
        }))
      );
      if (sidebarSelectedOfferList?.invoices) {
        setSidebarSelectedOfferList((prev) => ({
          ...prev,
          invoices: prev.invoices.map((inv) =>
            invoiceIds.includes(inv._id) ? { ...inv, status: "Ordered" } : inv
          ),
        }));
      }

      toast.success("Order Accepted");

      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/accept-buyer-bid`,
        { invoiceIds },
        { withCredentials: true }
      );

      if (response?.data?.success) {
        await fetchOfferLists(null, true);
        await getWatchlist();
        return true;
      }
    } catch (error) {
      console.error("Error accepting bid:", error);
      if (error.response?.data?.message === "One or more invoices have already been sold.") {
        toast.error("Lot already Sold");
      }
      fetchOfferLists(null, true);
      return false;
    }
  };

  const getNotifications = async () => {
    const endpoint =
      user?.userType === "seller"
        ? "get-seller-notifications"
        : "get-buyer-notifications";

    try {
      const response = await axios.get(
        `${currentBackendLink}/api/notification/${endpoint}`,
        { withCredentials: true }
      );

      if (response.data && response.data.success) {
        const result = response.data.notifications;
        console.log(result);

        setNotifications(result);
        const unreadCount = result.filter((notif) => !notif.isRead).length;
        setUnreadNotifications(unreadCount);
      } else {
        console.warn("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
    }
  };

  const changeSidebarForNewOffer = (offerListId, changeOfferlist = []) => {
    let findList;
    if (changeOfferlist.length > 0) {
      findList = changeOfferlist.find((val) => val._id === offerListId);
      console.log(findList);
    } else {
      findList = allOfferLists.find((val) => val._id === offerListId);
      console.log(findList);
    }
    if (!findList) {
      return;
    }

    setSidebarSelectedOfferList(findList);
  };

  const markAsRead = async (notificationIds) => {
    try {
      const response = await axios.put(
        `${currentBackendLink}/api/notification/mark-read`,
        { notificationIds },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <AppContext.Provider
      value={{
        handleShowLoginPage,
        showLoginPage,
        fetchOfferLists,
        isLoadingData,
        allOfferLists,
        raisePriceCongText,
        addBid,
        googleAuth,
        user,
        isLoading,
        verifyToken,
        addToWatchlist,
        watchlist,
        removeFromWatchlist,
        signupUserType,
        setSignupUserType,
        googleSignup,
        manualLogin,
        onboarding,
        changeSideBarOfferList,
        sidebarSelectedOfferList,
        handlePriceChange,
        getWatchlist,
        getOrders,
        userOrders,
        handleLogout,
        handlePriceChangeUsingInput,
        removeraisePriceCongText,
        currentBackendLink,
        downloadOfferList,
        fetchUpcomingOfferLists,
        upcomingOfferLists,
        acceptBid,
        getNotifications,
        unreadNotifications,
        notifications,
        changeSidebarForNewOffer,
        showLoader,
        updateOrderAddress,
        markAsRead,
        isVerifyingToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
