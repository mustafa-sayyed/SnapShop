import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = `${process.env.MONGO_URI}/${process.env.DB_NAME}`;
    const connectionInstance = await mongoose.connect(uri);
    console.log(
      `MongoDB Connected: DB: ${connectionInstance.connection.name}, host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
