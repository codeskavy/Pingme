import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

// Cookie options for JWT
const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

// MongoDB Connection
const connectDB = (uri) => {
  mongoose
    .connect(uri || process.env.MONGO_URI)
    .then((data) =>
      console.log(`✅ Connected to MongoDB: ${data.connection.host}`)
    )
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
};

// Send JWT token in HTTP-only cookie
const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("chattu-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

// Emit socket.io event to specified users
const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const userSockets = getSockets(users);
  io.to(userSockets).emit(event, data);
};

// Upload files to Cloudinary
const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );
    });
  });

  return await Promise.all(uploadPromises);
};

// Delete files from Cloudinary
const deletFilesFromCloudinary = async (public_ids = []) => {
  const deletePromises = public_ids.map((public_id) =>
    cloudinary.uploader.destroy(public_id, { resource_type: "auto" })
  );

  await Promise.all(deletePromises);
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
};
