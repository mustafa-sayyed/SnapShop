import { resend } from "../utils/resend.js";

const campaignEmail = (subject, content) => {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${subject}</title>
        </head>
        <body>

            <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 10px;">
                <h2 style="color: #4CAF50;">${subject}</h2>
                <div>
                    ${content}
                </div>
            </div>
            
        </body>
        </html>`;
};

export const sendCampaignEmail = async (to, subject, content) => {
  try {
    await resend.emails.send({
        from: "SnapShop <no-reply-snashop@mustafasayyed.dev>",
        to: to,
        subject: subject,
        html: campaignEmail(subject, content)
    })
  } catch (error) {
    console.log(error);
    return {
        success: false,
        message: "Failed to send email",
    }
  }
};
