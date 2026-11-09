import Invoice from "../models/invoice.model.js";

export const getInvoicesReqAdmin = async (req, res) => {
  try {
    const { offerlistId } = req.params;

    const invoices = await Invoice.find({ offerListNumber: offerlistId })
      .populate({
        path: "offerListNumber",
        select: "offerListNumber offerListStatus", // Only needed fields from OfferList
      })
      .populate({
        path: "allowedBuyers",
        select: "companyName", // Only companyName of allowed buyers
      })
      .populate({
        path: "highestBidder",
        select: "companyName", // Only companyName of highest bidder
      })
      .populate({
        path: "seller",
        select: "companyName", // Only companyName of seller
      })
      .exec();

    return res.status(200).json({
      success: true,
      invoices: invoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
