const mongoose =require('mongoose');

const connectDB = async () => {
  // Use environment variable for MongoDB connection string


  const mongoURI = process.env.MONGODB_URL;
  if (!mongoURI) {
    throw new Error("MongoDB connection string is not defined in environment variables");
  }

  try {
    await mongoose.connect(`${mongoURI}`)
    console.log("Connection to MongoDB established successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error(error);
  }
};

module.exports=connectDB