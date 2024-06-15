const express = require("express");
const zod = require("zod");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/db");
const { Account } = require("../models/db");
const crypto = require("crypto");
const { authmiddleware } = require("../middleware/auth");

// Validation schema using Zod
const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

// Signup endpoint
router.post("/signup", async (req, res) => {
  const { success, data } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      msg: "Invalid input data. Please provide valid email, first name, last name, and password.",
    });
  }

  const existingUser = await User.findOne({
    username: data.username,
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      msg: "Email already taken. Please use a different email address.",
    });
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hpassword = crypto
      .pbkdf2Sync(data.password, salt, 1000, 64, "sha512")
      .toString("hex");

    const user = await User.create({
      username: data.username,
      password: hpassword,
      firstName: data.firstName,
      lastName: data.lastName,
      salt: salt,
    });

    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      success: true,
      msg: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

// Validation schema for signin
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

// Signin endpoint
router.post("/signin", async (req, res) => {
  const { success, data } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      msg: "Invalid input data!"
    });
  }

  const existingUser = await User.findOne({
    username: data.username,
  });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      msg: "User not found!",
    });
  }

  const salt = existingUser.salt;
  const hpassword = crypto
    .pbkdf2Sync(data.password, salt, 1000, 64, "sha512")
    .toString("hex");

  if (hpassword !== existingUser.password) {
    return res.status(401).json({
      success: false,
      msg: "Incorrect password!",
    });
  }

  try {
    const userId = existingUser._id;
    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      msg: "Login successful.",
      token: token,
    });
  } catch (error) {
    console.error("Error in signin:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

// Update user endpoint
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authmiddleware, async (req, res) => {
  const { success, data } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      success: false,
      msg: "Invalid input data",
    });
  }

  try {
    await User.updateOne({ _id: req.userId }, data);

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Error in update:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

// Bulk user search endpoint
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  try {
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i", // Case insensitive search
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i", // Case insensitive search
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      msg: "Users retrieved successfully.",
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.error("Error in bulk search:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

module.exports = router;
