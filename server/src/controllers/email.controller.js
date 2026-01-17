import { Email } from "../models/email.model.js";
import { handleEmailCampaign } from "../utils/emailCampaign.js";

const getAllEmails = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 0;
    const search = req.query.search || "";
    const filter = search ? { subject: { $regex: search, $options: "i" } } : {};
    const totalEmails = await Email.countDocuments(filter);

    if (page < 0) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than or equal to 0",
      });
    }

    const emails = await Email.find(filter)
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      emails,
      totalEmails,
      page,
      limit,
      totalPages: Math.ceil(totalEmails / limit),
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const deleteEmailById = async (req, res) => {
  try {
    const emailId = req.params.emailId;

    const email = await Email.findByIdAndDelete(emailId);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email deleted successfully",
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const sendEmail = async (req, res) => {
  // Implementation for sending an email
  try {
    const { subject, content, audience } = req.body;

    const email = await Email.create({ subject, content, audience, recipientCount: 0 });

    // Async function to handle email campaign
    handleEmailCampaign(subject, content, audience, email._id);

    res
      .status(200)
      .json({ success: true, message: `Emails are being sent to ${audience}` });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export { getAllEmails, deleteEmailById, sendEmail };
