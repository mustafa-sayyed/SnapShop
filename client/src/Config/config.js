const _config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
};

export const config = Object.freeze(_config);
