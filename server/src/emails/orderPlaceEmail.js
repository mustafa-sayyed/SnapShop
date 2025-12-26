import { resend } from "../utils/resend";

const orderPlaceEmail = (username, orderDetails) => {
  return `
            <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${username} your Order Placed successfully</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:20px;">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:6px;">
                        <tr>
                            <td style="padding:30px; text-align:center;">
                                <h2 style="color:#333333;">Your Order Placed successfully</h2>
                                <p style="color:#555555; font-size:14px; line-height:1.6;">
                                    Your order was palced successfully

                                    Order Details: ${orderDetails}
                                </p>
                                <p style="color:#555555; font-size:14px; line-height:1.6;">
                                    Discover amazing products, exclusive deals, and a smooth shopping experience—all in one place.
                                </p>
                                <a href="htts://snapshop.mustafasayyed.tech" 
                                style="display:inline-block; margin-top:20px; padding:12px 25px; 
                                        background-color:#007bff; color:#ffffff; 
                                        text-decoration:none; border-radius:4px; font-size:14px;">
                                    Start Shopping
                                </a>
                                <p style="margin-top:30px; color:#888888; font-size:12px;">
                                    Happy shopping,<br>
                                    <strong>The SnapShop Team</strong>
                                </p>
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

export const sendOrderPlaceEmail = async (to) => {
  try {
    const res = resend.emails.send({
      from: "SnapShop <dev@mustafasayyed.dev>",
      to: to,
      subject: "Your Order Placed successfully",
      html: orderPlaceEmail(name, order),
    });

    console.log("Order Place Email: ", res);

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error while sending order placed email",
    };
  }
};
