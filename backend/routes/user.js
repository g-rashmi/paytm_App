const express = require("express");
const zod = require("zod");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../models/db");
const { Account } = require("../models/db");
const crypto = require("crypto");
const { authmiddleware } = require("../middleware/auth");

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Incorrect inputs or email already taken",
    });
  }

  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).json({
      msg: "Email already taken",
    });
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
      .toString("hex");

    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      salt: salt,
    });

    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      msg: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Incorrect input data",
    });
  }

  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (!existingUser) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    const salt = existingUser.salt;
    const hashedPassword = crypto
      .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (hashedPassword !== existingUser.password) {
      return res.status(400).json({
        msg: "Incorrect password",
      });
    }

    const { firstName, lastName, _id: userId } = existingUser;

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET
    );

    res.json({
      firstname: firstName,
      lastname: lastName,
      token: token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.put("/", authmiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Error while updating information",
    });
  }

  try {
    await User.updateOne({ _id: req.userId }, req.body);
    return res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ],
    });

    return res.json({
      users: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error",
    });
  }
});

module.exports = router;
