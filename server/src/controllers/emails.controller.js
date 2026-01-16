import { Email } from "../models/emails.model";

const getAllEmails = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const search = req.query.search || "";
    const filter = search ? { subject: { $regex: search, $options: "i" } } : {};
    const totalEmails = await Email.countDocuments();

    const emails = await Email.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, emails, totalEmails, page, limit });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const deleteEmailById = async (req, res) => {
  try {
    const emailId = req.params.emailId;

    const email = await Email.findByIdAndDelete(emailId);

    if (!email) {
      return res.json({
        success: false,
        message: "Email not found",
      });
    }

    res.json({
      success: true,
      message: "Email deleted successfully",
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const sendEmail = async (req, res) => {
  // Implementation for sending an email
  try {
    const { subject, content, audience } = req.body;

    // logic to implement to send email campaign at scale
    // maybe using Batch Processing with a queue system like Bull

    await Email.create({ subject, content, audience, userCount: 0 });

    res.json({ success: true, message: `Emails are being sent to ${audience}` });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export { getAllEmails, deleteEmailById, sendEmail };
