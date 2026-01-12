import { resend } from "../utils/resend.js";

const resetPasswordEmail = (resetToken) => {
  const resetUrl = `${process.env.USER_FRONTEND_URL}/reset-password/${resetToken}`;
  return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            <div
            style="
                max-width: 500px;
                background: #ffffff;
                padding: 25px;
                border-radius: 8px;
                margin: auto;
            "
            >
            <h1>Password Reset Request</h1>

            <p>
                You requested to reset your password. Click the button below to set a
                new password
            </p>

            <a
                href="${resetUrl}"
                style="
                display: inline-block;
                padding: 12px 20px;
                background-color: rgb(248, 10, 58);
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin-top: 20px;
                "
            >
                Reset Password
            </a>

            <p style="margin-top: 20px;">
                This link will expire in <strong>15 minutes</strong>.
            </p>

            <p>
                If you did not request a password reset, you can safely ignore this
                email.
            </p>

            <p style="font-size: 12px; color: #666; margin-top: 30px;">
                © SnapShop. All rights reserved.
            </p>
            </div>
        </body>
    </html>
    `;
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    await resend.emails.send({
      from: "SnapShop <no-reply-snapshop@mustafasayyed.dev>",
      to: [email],
      subject: "Reset Your Password",
      html: resetPasswordEmail(resetToken),
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
