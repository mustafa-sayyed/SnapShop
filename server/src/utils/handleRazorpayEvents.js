import { Orders } from "../models/order.model.js";

const handleCapturedEvent = async (paymentDetails) => {
  try {
    const order = await Orders.findById(paymentDetails.notes.orderId);

    if (!order) {
      console.log("Order not found for payment:", paymentDetails.id);
      return;
    }

    if (order.paymentStatus !== "completed") {
      order.paymentStatus = "completed";
      order.paymentDetails = paymentDetails;
      await order.save();
    }
  } catch (error) {
    console.log('Error while handling Razorpay captured event', error);
  }
};

const handleFailedEvent = async (paymentDetails) => {
  try {
    const order = await Orders.findById(paymentDetails.notes.orderId);

    if (!order) {
      console.log("Order not found for payment:", paymentDetails.id);
      return;
    }

    if (order.paymentStatus !== "failed") {
      order.paymentStatus = "failed";
      order.paymentDetails = paymentDetails;
      await order.save();
    }
  } catch (error) {
    console.log('Error While handling Razorpay failed event', error);
    
  }
};

export const handleRazorpayEvents = (event) => {
  switch (event.event) {
    case "payment.captured":
      handleCapturedEvent(event.payload.payment.entity);
      break;

    case "payment.failed":
      handleFailedEvent(event.payload.payment.entity);
      break;

    default:
      console.log("Unknown Raozorpay Event Occurred", event);
      break;
  }
};
