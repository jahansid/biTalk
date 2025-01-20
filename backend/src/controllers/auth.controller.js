import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All field to be filled" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    //check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    //hashing password
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRound);
    // create and save user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    //generating jwt token here

    if (newUser) {
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "User data not found" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    //validating password comparing with saved password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //generate and send the token
    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = user.body;
    const userId = req.user._id;
    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    //uploading on cloudinary
    const uploadResponse = cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("error in updating profile", error.message);
    return res.status(500).json({ message: "server error" });
  }
};

export const checkRoute = (req, res)=>{
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkRoute controller:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}
