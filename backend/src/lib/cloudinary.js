
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// if (!process.env.CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error("Missing Cloudinary configuration in .env file");
//   }

export default cloudinary;
