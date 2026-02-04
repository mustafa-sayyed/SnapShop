const errorHandler = (err, req, res, next) => {
  console.log(err);

  const message = err.message || "Internal Server Error";
  const status = err.status || 500;
  const errorStack = process.env.NODE_ENV === "development" ? err : undefined;
  
  res.status(status).json({ success: false, message, errorStack });
};

export default errorHandler;
