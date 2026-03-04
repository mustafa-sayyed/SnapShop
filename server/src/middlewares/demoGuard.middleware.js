const demoGuard = (req, res, next) => {
  if (req.user?.role !== "demo_admin") {
    return next();
  }

  const blockedMethods = ["POST", "PUT", "PATCH", "DELETE"];

  if (blockedMethods.includes(req.method)) {
    return res.status(403).json({
      success: false,
      message: "🔒 Demo Mode: This action is restricted. Sign up for full admin access!",
      isDemo: true,
    });
  }

  next();
};

export default demoGuard;