import { resend } from "../utils/resend.js";

const subscriberEmail = (email, unsubscribeToken) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to SnapShop</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">SnapShop</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">Welcome to Our Community! 🎉</h2>
                            <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">Dear ${email},</p>
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">Thank you for subscribing to SnapShop! We're thrilled to have you join our community of savvy shoppers.</p>
                            
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">As a valued subscriber, you'll receive:</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.8;">
                                    <li>New product launches and featured items</li>
                                    <li>Exclusive discounts and special promotions</li>
                                    <li>Seasonal sales and limited-time offers</li>
                                    <li>Tips and tricks for the best shopping experience</li>
                                </ul>
                            </div>
                            
                            <p style="margin: 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">Stay tuned for exciting updates coming your way soon!</p>
                            <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">Best regards,<br/><strong style="color: #333333;">The SnapShop Team</strong></p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0; color: #999999; font-size: 14px;">© 2024 SnapShop. All rights reserved.</p>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <p style="font-size: 12px; color: #999999; text-align: center; margin-top: 10px;">
                                If you wish to unsubscribe from our emails, please <a href="${process.env.USER_FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}" style="color: #007bff; text-decoration: none;">click here</a>.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

export const sendSubscribeEmail = async (email, unsubscribeToken) => {
  try {
    await resend.emails.send({
      from: "SnapShop <no-reply-snapshop@mustafasayyed.dev>",
      to: email,
      subject: "Thank you for subscribing to email",
      html: subscriberEmail(email, unsubscribeToken),
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error while sending email",
    };
  }
};
