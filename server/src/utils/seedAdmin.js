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

export default seedAdmin;
