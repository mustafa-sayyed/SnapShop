import { resend } from "../utils/resend.js";

const welcomeEmail = (name) => {
  return `
            <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Welcome ${name} to SnapShop</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:20px;">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:6px;">
                        <tr>
                            <td style="padding:30px; text-align:center;">
                                <h2 style="color:#333333;">Welcome to SnapShop! 🎉</h2>
                                <p style="color:#555555; font-size:14px; line-height:1.6;">
                                    Thank you ${name} for joining <strong>SnapShop</strong>. We’re excited to have you with us!
                                </p>
                                <p style="color:#555555; font-size:14px; line-height:1.6;">
                                    Discover amazing products, exclusive deals, and a smooth shopping experience—all in one place.
                                </p>
                                <a href="https://snapshop.mustafasayyed.dev" target="_blank"
                                style="display:inline-block; margin-top:20px; padding:12px 25px; 
                                        background-color:#007bff; color:#ffffff; 
                                        text-decoration:none; border-radius:4px; font-size:14px;">
                                    Start Shopping
                                </a>
                                <p style="margin-top:30px; color:#888888; font-size:12px;">
                                    Happy shopping,<br>
                                    <strong>The SnapShop Team</strong>
                                </p>

                                <p style="margin-top: 20px; font-size:12px; color:#888888;">Do not reply to this email, This is an auto generated email</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export async function sendWelcomeEmail(email, username) {
  try {
    const res = await resend.emails.send({
      from: "SnapShop <no-reply-snapshop@mustafasayyed.dev>",
      to: [email],
      subject: "Welcome to SnapShop!! 🎉",
      html: welcomeEmail(username),
    });

    console.log("email: ", res);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error while sending welcome email" };
  }
}
