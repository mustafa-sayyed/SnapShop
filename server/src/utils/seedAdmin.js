import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const exists = await User.findOne({ email: adminEmail });

    if (!exists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Super Admin Created.");
    }
  } catch (error) {
    console.log(`Internal Server error while creating Super Admin: ${error.message}`);
  }
};

const seedDemoAdmin = async () => {
  try {
    const demoEmail = process.env.DEMO_ADMIN_EMAIL || "demo@admin.com";
    const demoPassword = process.env.DEMO_ADMIN_PASSWORD || "demo123";
    const exists = await User.findOne({ email: demoEmail });

    if (!exists) {
      const hashedPassword = await bcrypt.hash(demoPassword, 10);

      await User.create({
        name: "Demo Admin",
        email: demoEmail,
        password: hashedPassword,
        role: "demo_admin",
      });

      console.log("Demo Admin Created.");
    }
  } catch (error) {
    console.log(`Internal Server error while creating Demo Admin: ${error.message}`);
  }
};

export { seedAdmin, seedDemoAdmin };
export default seedAdmin;
