import { sendCampaignEmail } from "../emails/campaign.email.js";
import { Email } from "../models/email.model.js";
import { Subscriber } from "../models/subscribe.model.js";

export const handleEmailCampaign = async (subject, content, audience, emailId) => {
  try {
    const filter =
      audience === "all"
        ? {}
        : audience === "subscribers"
        ? { status: "active" }
        : { status: "unsubscribed" };

    const users = await Subscriber.find(filter).select("email");

    const batchSize = 20;
    const totalBatches = Math.ceil(users.length / batchSize);
    let batchNo = 1;

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (batchNo = 1; batchNo <= totalBatches; batchNo++) {
      const emailBatch = users
        .slice((batchNo - 1) * batchSize, batchNo * batchSize)
        .map((user) => user.email);

      for (const email of emailBatch) {
        await sendCampaignEmail(email, subject, content);
      }

      await delay(3000); // 3 second delay between batches
    }

    await Email.findByIdAndUpdate(emailId, {
      status: "sent",
      recipientCount: users.length,
    });
  } catch (error) {
    console.log(error);
    await Email.findByIdAndUpdate(emailId, { status: "failed" });
  }
};
