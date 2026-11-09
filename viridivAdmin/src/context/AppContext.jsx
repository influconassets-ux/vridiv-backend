import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  // const currentBackendLink = `http://localhost:8000`;
  const currentBackendLink = `https://vridiv-backend-ele9.onrender.com`;
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const [raisePriceCongText, setRaisePriceCongText] = useState(false);
  const [allOfferLists, setAllOfferLists] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [verifiedUsers, setVerifiedUser] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  const [allBuyers, setAllBuyers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);

  const [userOrders, setUserOrders] = useState([]);

  const [sidebarSelectedOfferList, setSidebarSelectedOfferList] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handlePriceChange = (invoiceId, change) => {
    setSidebarSelectedOfferList((prevOfferList) => ({
      ...prevOfferList,
      invoices: prevOfferList?.invoices?.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, adminBid: invoice.adminBid + change }
          : invoice
      ),
    }));
  };

  const changeSideBarOfferList = (offerList) => {
    if (offerList) {
      setSidebarSelectedOfferList(offerList);
    } else {
      setSidebarSelectedOfferList("");
    }
  };

  const fetchOfferLists = async (silent = false) => {
    // console.log("fetchOfferLists");
    if (!silent) setIsLoadingData(true);
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/offer-list/get-lists-admin`
      );

      const result = response.data.offerLists;
      // console.log(result);

      if (!sidebarSelectedOfferList) {
        setSidebarSelectedOfferList("");
        // setSidebarSelectedOfferList(result[0]);
      } else {
        const updatedSelected = result.find(
          (offerList) => offerList._id === sidebarSelectedOfferList._id
        );
        if (updatedSelected) {
          setSidebarSelectedOfferList(updatedSelected);
        }
        if (!updatedSelected) {
          setSidebarSelectedOfferList(result[0]);
        }
      }
      // console.log(result);

      setAllOfferLists(result);
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      if (!silent) setIsLoadingData(false);
    }
  };

  const fetchAllInvoices = async (silent = false) => {
    // console.log("fetchAllInvoices");
    if (!silent) setIsLoadingData(true);
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/offer-list/get-invoices-admin`
      );

      const sortedInvoices = response.data.invoices.sort((a, b) => {
        // Step 1: Push "Ordered" invoices to the end
        if (a.status === "Ordered" && b.status !== "Ordered") return 1;
        if (a.status !== "Ordered" && b.status === "Ordered") return -1;

        const hasBidTimeA = Boolean(a.highestBidTime);
        const hasBidTimeB = Boolean(b.highestBidTime);

        // Step 2: If one has highestBidTime and the other doesn't
        if (hasBidTimeA && !hasBidTimeB) return -1;
        if (!hasBidTimeA && hasBidTimeB) return 1;

        // Step 3: If both have highestBidTime, compare them
        if (hasBidTimeA && hasBidTimeB) {
          return new Date(b.highestBidTime) - new Date(a.highestBidTime);
        }

        // Step 4: Otherwise, compare updatedAt
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      // console.log(sortedInvoices);

      setAllInvoices(sortedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      if (!silent) setIsLoadingData(false);
    }
  };

  const addBid = async (invoiceIds, price) => {
    console.log(invoiceIds);

    setIsLoadingData(true);
    const userType = "admin";

    try {
      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/add-bid`,
        {
          invoiceIds,
          userType,
          price,
        }
      );

      const result = response.data.offerLists;
      console.log(response);
      console.log(result);
      setAllOfferLists(result);
      if (response.data) {
        toast.success("Bid Placed Successfully");
      }
    } catch (err) {
      console.error("Error adding bid:", err.response?.data || err.message);
      toast.error(err.response?.data?.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const acceptBid = async (invoiceIds) => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/accept-bid`,
        {
          invoiceIds,
        },
        {
          withCredentials: true,
        }
      );

      const result = response.data.offerLists;
      console.log(result);
      setAllOfferLists(result);
      toast.success("Price Accepted");
    } catch (err) {
      console.error("Error adding bid:", err.response?.data || err.message);
      toast.success("Something Went Wrong");
    }
  };

  const handleShowLoginPage = () => {
    setShowLoginPage((prev) => !prev);
  };

  const addOfferList = async (rows, selectedOfferListStatus) => {
    if (!rows || rows.length === 0) {
      console.error("No data to send.");
      return;
    }

    // Extract Offer List Number
    const offerListNumber = rows[0].offerListNumber;
    const sellerId = rows[0].sellerName._id;
    const offerListStatus = selectedOfferListStatus;

    // Transform rows to match server field names
    const invoices = rows.map((row) => ({
      invoiceNumber: row.invoiceNumber || "",
      mark: row.mark || "",
      grade: row.grade || "",
      quantity: row.quantity || "",
      bags: row.bags || "",
      price: row.price || "",
      sellerId: row.sellerName._id || "", // Includes full seller object
      buyers: row.buyers || [], // Includes array of buyers
    }));

    // Prepare payload
    const payload = {
      offerListNumber,
      sellerId,
      invoices,
      offerListStatus,
    };

    try {
      const response = await axios.post(
        `${currentBackendLink}/api/offer-list/add-list`,
        payload,
        {
          withCredentials: true, // ✅ Ensures cookies are sent for authentication
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Offerlist Added");
        console.log("✅ Offer List added successfully:", response.data);
      } else {
        console.error("⚠️ Error adding Offer List:", response.data.message);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      console.error(
        "❌ Error sending data:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Something Went Wrong");
      return error.response.data;
    }
  };

  const fetchPendingUser = async () => {
    try {
      setIsFetching(true); // Start fetching

      const response = await axios.get(
        `${currentBackendLink}/api/auth/pending-users`,
        {
          withCredentials: true, // Ensures cookies are sent with the request
        }
      );
      // console.log(response);
      if (response.status === 200) {
        setPendingUsers(response.data);
      } else {
        console.error("Failed to fetch pending users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setIsFetching(false); // Stop fetching
    }
  };
  const fetchVerifiedUsers = async () => {
    try {
      setIsFetching(true); // Start fetching

      const response = await axios.get(
        `${currentBackendLink}/api/auth/get-verified-users`,
        {
          withCredentials: true, // Ensures cookies are sent with the request
        }
      );
      console.log(response);
      if (response.status === 200) {
        setVerifiedUser(response.data);
      } else {
        console.error("Failed to fetch pending users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setIsFetching(false); // Stop fetching
    }
  };

  const verifyUser = async (userId) => {
    console.log("verifyUser");

    try {
      const response = await axios.put(
        `${currentBackendLink}/api/auth/verify-user/${userId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setPendingUsers(data.pendingUsers);
        }

        toast.success("User verified successfully");
        // console.log("User verified successfully:", response.data);
      }
    } catch (error) {
      console.error(
        "Error verifying user:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const rejectUser = async (userId, rejectionReason) => {
    console.log("rejectUser");
    setIsFetching(true);
    try {
      const response = await axios.put(
        `${currentBackendLink}/api/auth/reject-user/${userId}`,
        { rejectionReason },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.success) {
          setPendingUsers(data.pendingUsers);
        }
        console.log("User rejected successfully:", response.data);
      }
    } catch (error) {
      console.error(
        "Error rejecting user:",
        error.response?.data?.message || error.message
      );
      setIsFetching(false);
    } finally {
      setIsFetching(false);
    }
  };

  const getBuyers = async () => {
    try {
      setIsFetching(true); // Optional: If you have a loading state
      const response = await axios.get(
        `${currentBackendLink}/api/auth/get-all-buyers`,
        {
          withCredentials: true, // Ensure credentials are included if needed
        }
      );

      if (response.status === 200 && response.data.success) {
        setAllBuyers(response.data.buyers);
      } else {
        console.error("Failed to fetch buyers:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching buyers:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsFetching(false); // Optional: Stop loading state
    }
  };
  const getSellers = async () => {
    try {
      setIsFetching(true); // Optional: If you have a loading state
      const response = await axios.get(
        `${currentBackendLink}/api/auth/get-all-sellers`,
        {
          withCredentials: true, // Ensure credentials are included if needed
        }
      );

      if (response.status === 200 && response.data.success) {
        // console.log(response.data.sellers);
        setAllSellers(response.data.sellers);
      } else {
        console.error("Failed to fetch buyers:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching buyers:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsFetching(false); // Optional: Stop loading state
    }
  };

  const deleteInvoice = async (invoiceIds) => {
    setIsLoadingData(true);
    try {
      const response = await axios.delete(
        `${currentBackendLink}/api/offer-list/delete-invoice`,
        {
          data: { invoiceIds }, // ✅ send invoiceIds array in body
          withCredentials: true,
        }
      );

      const result = response.data.offerLists;
      setAllOfferLists(result);
      await fetchAllInvoices();

      // const isSelectedOfferListPresent = result.some(
      //   (offerList) => offerList._id === sidebarSelectedOfferList?._id
      // );

      // if (isSelectedOfferListPresent) {
      //   const updatedSelectedOfferList = result.find(
      //     (offerList) => offerList._id === sidebarSelectedOfferList?._id
      //   );
      //   if (!updatedSelectedOfferList) {
      //     setSidebarSelectedOfferList("");
      //   }
      //   setSidebarSelectedOfferList(updatedSelectedOfferList);
      // }

      // if (!isSelectedOfferListPresent && result.length > 0) {
      //   setSidebarSelectedOfferList(result[0]);
      // }

      // if (!isSelectedOfferListPresent && result.length === 0) {
      //   setSidebarSelectedOfferList([]);
      // }
    } catch (error) {
      console.error("Error deleting invoices:", error);
      throw (
        error.response?.data || {
          success: false,
          message: "Failed to delete invoice(s)",
        }
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const getOrders = async () => {
    setIsLoadingData(true);
    // console.log("Fetching orders");

    try {
      const response = await axios.get(
        `${currentBackendLink}/api/order/get-admin-orders`,
        { withCredentials: true }
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
      setIsLoadingData(false);
    }
  };

  const uploadInvoiceDocs = async ({
    taxInvoice,
    cNote,
    eWayBill,
    deliveryOrder,
    orderId,
  }) => {
    setShowLoader(true);
    const formData = new FormData();
    if (taxInvoice) {
      formData.append("taxInvoice", taxInvoice);
    }

    if (cNote) {
      formData.append("cNote", cNote);
    }

    if (eWayBill) {
      formData.append("eWayBill", eWayBill);
    }
    if (deliveryOrder) {
      formData.append("deliveryOrder", deliveryOrder);
    }
    formData.append("orderId", orderId);

    try {
      const response = await axios.post(
        `${currentBackendLink}/api/order/upload-order-documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const result = response.data;
      if (result.success) {
        setUserOrders(result.orders);
        toast.success("Documents Uploaded Successfullly");
      }
    } catch (error) {
      console.error("❌ Upload failed:", error);
      toast.success("Failed to upload documents");
    } finally {
      setShowLoader(false);
    }
  };

  const generateSon = async (invoiceIds, cashDiscount, daysCount) => {
    console.log(invoiceIds);

    setShowLoader(true);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/order/generate-son`,
        { invoiceIds, cashDiscount, daysCount },
        { withCredentials: true }
      );

      const result = response.data;
      if (result.success) {
        setUserOrders(result.orders);
        toast.success("Sale Order Generated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setShowLoader(false);
    }
  };

  const updateDeliveryStatus = async (orderId, newStatus) => {
    setShowLoader(true);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/order/update-delivery-status`,
        { orderId, newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const result = response.data;

      if (result.success) {
        setUserOrders(result.orders);
        toast.success("Delivery status updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating delivery status:", error);
      toast.error("Something went wrong while updating status");
    } finally {
      setShowLoader(false);
    }
  };

  const updateBankDetails = async (orderIds, bankDetails) => {
    setShowLoader(true);
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/order/update-bankdetails`,
        { orderIds, bankDetails },
        { withCredentials: true }
      );

      const result = response.data;
      if (result.success) {
        setUserOrders(result.orders);
        toast.success("Bank details updated successfully");
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error("Failed to update bank details");
    } finally {
      setShowLoader(false);
    }
  };

  const updateOfferlistStatus = async (offerlistId, offerListStatus) => {
    try {
      toast.success("Status updated successfully");

      const response = await axios.put(
        `${currentBackendLink}/api/offer-list/update-offerlist-status`,
        {
          offerlistId,
          offerListStatus,
        }
      );

      const result = response.data.offerLists;
      setAllOfferLists(result);
      await fetchAllInvoices(true);

      setSidebarSelectedOfferList((prevSelectedOffer) =>
        prevSelectedOffer && prevSelectedOffer._id === offerlistId
          ? { ...prevSelectedOffer, offerListStatus }
          : prevSelectedOffer
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating offerlist status:", error);
      toast.error(error.response?.data?.message || "Something Went wrong");
      return false;
    }
  };

  const updateBuyers = async (invoiceId, newBuyers) => {
    try {
      // 1. OPTIMISTIC UPDATE: Update local state immediately for a snap-fast UI
      const buyerIds = newBuyers.map((buyer) => buyer._id);

      // Update allOfferLists optimistically
      setAllOfferLists((prev) =>
        prev.map((ol) => ({
          ...ol,
          invoices: ol.invoices.map((inv) =>
            inv._id === invoiceId ? { ...inv, allowedBuyers: newBuyers } : inv
          ),
        }))
      );

      // Update allInvoices optimistically
      setAllInvoices((prev) =>
        prev.map((inv) =>
          inv._id === invoiceId ? { ...inv, allowedBuyers: newBuyers } : inv
        )
      );

      // Update sidebar selection optimistically
      if (sidebarSelectedOfferList?.invoices) {
        setSidebarSelectedOfferList((prev) => ({
          ...prev,
          invoices: prev.invoices.map((inv) =>
            inv._id === invoiceId ? { ...inv, allowedBuyers: newBuyers } : inv
          ),
        }));
      }

      toast.success("Buyers updated successfully");

      // 2. BACKEND UPDATE: Run in background
      const response = await axios.put(
        `${currentBackendLink}/api/offer-list/update-buyers`,
        {
          invoiceId,
          newBuyers: buyerIds,
        }
      );

      // Sync with final server state
      const result = response.data.offerLists;
      setAllOfferLists(result);
      await fetchAllInvoices(true);

      if (sidebarSelectedOfferList?._id) {
        const filterOfferlist = result.filter(
          (val) => val._id === sidebarSelectedOfferList._id
        );
        if (filterOfferlist.length > 0) {
          setSidebarSelectedOfferList(filterOfferlist[0]);
        }
      }


      return true;
    } catch (error) {
      console.error("Error updating buyers:", error);
      const msg = error.response?.data?.message || "Failed to update buyers";
      toast.error(msg);
      // Optional: Refetch on error to revert optimistic change
      fetchOfferLists(true);
      fetchAllInvoices(true);
      return { error: msg };
    }
  };

  const updateBuyersForMultipleInvoices = async (invoiceIds, newBuyers) => {
    try {
      // 1. OPTIMISTIC UPDATE
      const buyerIds = newBuyers.map((buyer) => buyer._id);

      setAllOfferLists((prev) =>
        prev.map((ol) => ({
          ...ol,
          invoices: ol.invoices.map((inv) =>
            invoiceIds.includes(inv._id)
              ? { ...inv, allowedBuyers: newBuyers }
              : inv
          ),
        }))
      );

      setAllInvoices((prev) =>
        prev.map((inv) =>
          invoiceIds.includes(inv._id)
            ? { ...inv, allowedBuyers: newBuyers }
            : inv
        )
      );

      if (sidebarSelectedOfferList?.invoices) {
        setSidebarSelectedOfferList((prev) => ({
          ...prev,
          invoices: prev.invoices.map((inv) =>
            invoiceIds.includes(inv._id)
              ? { ...inv, allowedBuyers: newBuyers }
              : inv
          ),
        }));
      }

      toast.success("Buyers updated for multiple invoices");

      // 2. BACKEND UPDATE
      const response = await axios.put(
        `${currentBackendLink}/api/offer-list/update-buyers-multiple-ids`,
        {
          invoiceIds,
          newBuyers: buyerIds,
        }
      );

      const result = response.data.offerLists;
      setAllOfferLists(result);
      await fetchAllInvoices(true);

      if (sidebarSelectedOfferList?._id) {
        const filterOfferlist = result.filter(
          (val) => val._id === sidebarSelectedOfferList._id
        );
        if (filterOfferlist.length > 0) {
          setSidebarSelectedOfferList(filterOfferlist[0]);
        }
      }


      return true;
    } catch (error) {
      console.error("Error updating buyers for multiple invoices:", error);
      const msg = error.response?.data?.message || "Failed to update buyers";
      toast.error(msg);
      fetchOfferLists(true);
      fetchAllInvoices(true);
      return { error: msg };
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

  const getNotifications = async () => {
    setIsLoadingData(true);
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/notification/get-admi-notifications`
      );

      if (response.data && response.data.success) {
        const result = response.data.notifications;
        // console.log(result);

        if (result.length > 0) {
          setNotifications(result);
          const unreadCount = result.filter((notif) => !notif.isRead).length;
          setUnreadNotifications(unreadCount);
        }
      } else {
        console.warn("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
    } finally {
      setIsLoadingData(false);
    }
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

  const changeSidebarForNewOffer = (offerListId) => {
    const findList = allOfferLists.find((val) => val._id === offerListId);
    console.log(findList);

    setSidebarSelectedOfferList(findList);
  };

  const deleteOfferList = async (offerListId) => {
    try {
      const response = await axios.delete(
        `${currentBackendLink}/api/offer-list/delete-offerlist`,
        {
          data: { offerListId },
        }
      );

      if (response.data.success) {
        console.log("Offer list deleted successfully:", response.data.message);
      } else {
        console.warn("Failed to delete offer list:", response.data.message);
      }

      if (response.data.success) {
        await fetchOfferLists();
      }
    } catch (error) {
      console.error(
        "Error deleting offer list:",
        error.response?.data || error.message
      );
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong.",
      };
    }
  };

  const verifyToken = async () => {
    // console.log("🔵 verifyToken called");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/auth/verify-admin-token`,
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (response.data.success) {
        if (
          response.data.user.userType === "admin" ||
          response.data.user.userType === "superAdmin"
        ) {
          // console.log("Admin Token verified");

          setUser(response.data.user);
          return true;
        }
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error(
        "Token verification failed:",
        error.response?.data || error.message
      );
      setUser(null);
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const manualLogin = async (formData) => {
    try {
      console.log("handle Submit");
      const response = await axios.post(
        `${currentBackendLink}/api/auth/manual-admin-login`,
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
      console.log(error.response);
      return error.response.data;
    }
  };

  const downloadAllUsersExcel = async () => {
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/auth/download-users-excel`,

        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "All_Users.xlsx"); // Trigger file download
    } catch (error) {
      console.error("❌ Failed to download Excel:", error);
      alert("Failed to download user data. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/admin-logout`,
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

  const downloadOrdersReport = async (startDate = "", endDate = "") => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/order/download-orders`,
        { startDate, endDate },
        {
          responseType: "blob",
          withCredentials: true, // Important for downloading binary files
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "Orders.xlsx");
    } catch (error) {
      console.error("Error downloading order report:", error);
      alert("Failed to download order report.");
    }
  };

  const downloadOfferListData = async (offerlistId) => {
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/offer-list/download-offerlist/${offerlistId}`,

        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "Offerlist.xlsx");
    } catch (error) {
      console.error("Error downloading order report:", error);
      alert("Failed to download order report.");
    }
  };

  const downloadUtil = async (formData, dataType) => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/data/download-buyer-wise-invoice`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "buyerWiseInvoices.xlsx");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message);
    }
  };

  const uploadUserDocuments = async (formData) => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/upload-user-documents`,
        formData,
        {
          headers: {},
          withCredentials: true,
        }
      );
      const data = response.data;
      const updatedVerifiedUsers = verifiedUsers.map((user) =>
        user._id === data.updatedUser._id
          ? { ...user, folderLink: data.updatedUser.folderLink } // new object
          : user
      );
      setVerifiedUser(updatedVerifiedUsers);
      console.log(data);
      toast.success("Documents Updated");
    } catch (error) {
      console.error("Error submitting Files:", error);
      toast.error("Something Went Wrong");
    }
  };

  const updateUserGstOrFssai = async (userId, gst, fssai) => {
    console.log(userId);
    console.log(gst);
    console.log(fssai);

    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/update-user-gst-fssai`,
        {
          userId,
          gst,
          fssai,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      const updatedVerifiedUsers = verifiedUsers.map((user) =>
        user._id === data.updatedUser._id
          ? { ...user, folderLink: data.updatedUser.folderLink } // new object
          : user
      );
      setVerifiedUser(updatedVerifiedUsers);
      console.log(data);
      toast.success("Updated Successfully");
    } catch (error) {
      console.error("Error updating GST/FSSAI:", error);
      return (
        error.response?.data || { success: false, message: "Unknown error" }
      );
    }
  };

  const createAdminAccount = async (data) => {
    try {
      const response = await axios.post(
        `${currentBackendLink}/api/user/admin-signup`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return (
        error.response?.data || { success: false, message: "Unknown error" }
      );
    }
  };
  const fetchAdminAccounts = async () => {
    console.log("fetchAdminAccounts");
    try {
      const response = await axios.get(
        `${currentBackendLink}/api/user/admin-users`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return (
        error.response?.data || { success: false, message: "Unknown error" }
      );
    }
  };
  const deleteAdminAccount = async (accountId) => {
    console.log("delete admin");
    try {
      const response = await axios.delete(
        `${currentBackendLink}/api/user/delete-admin/${accountId}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
      return (
        error.response?.data || { success: false, message: "Unknown error" }
      );
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
        acceptBid,
        addOfferList,
        pendingUsers,
        isFetching,
        fetchPendingUser,
        verifyUser,
        rejectUser,
        getBuyers,
        allBuyers,
        getSellers,
        allSellers,
        sidebarSelectedOfferList,
        changeSideBarOfferList,
        deleteInvoice,
        handlePriceChange,
        userOrders,
        getOrders,
        updateOfferlistStatus,
        updateBuyers,
        downloadOfferList,
        uploadInvoiceDocs,
        fetchAllInvoices,
        allInvoices,
        getNotifications,
        notifications,
        unreadNotifications,
        changeSidebarForNewOffer,
        deleteOfferList,
        verifyToken,
        isLoading,
        manualLogin,
        user,
        showLoader,
        generateSon,
        updateBankDetails,
        updateDeliveryStatus,
        downloadAllUsersExcel,
        handleLogout,
        downloadOrdersReport,
        downloadOfferListData,
        fetchVerifiedUsers,
        verifiedUsers,
        uploadUserDocuments,
        updateUserGstOrFssai,
        markAsRead,
        downloadUtil,
        updateBuyersForMultipleInvoices,
        createAdminAccount,
        fetchAdminAccounts,
        deleteAdminAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
