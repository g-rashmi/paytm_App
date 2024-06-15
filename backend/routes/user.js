// backend/routes/user.js
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
    return res.status(411).json({
      msg: "incorrect inputs",
      "success": false
    });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      msg: "Email already taken",
      "success": false,
    });
  }
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hpassword = crypto
      .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
      .toString("hex");
    const user = await User.create({
      username: req.body.username,
      password: hpassword,
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
      {
        userId,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      msg: "user created successfully",
      "success": true,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
});

const signinbody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinbody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "input data wrong",
      "success": false,
    });
  }
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  if (!existingUser) {
    return res.status(411).json({
      msg: "user not found ",
      "success": false,
    });
  }
  const salt = existingUser.salt;
  const hpassword = crypto
    .pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512")
    .toString("hex");
  if (hpassword !== existingUser.password) {
    return res.status(411).json({
      msg: "Incorrect-Password",
      "success": false,
    });
  }

  try {
    const firstname = existingUser.firstName;
    const lastname = existingUser.lastName;
    const userId = existingUser._id;
    if (existingUser) {
      const token = jwt.sign(
        {
          userId,
        },
        process.env.JWT_SECRET
      );
      res.json({
        firstname: firstname,
        token: token,
        lastname: lastname,
        password: password, 
        msg:"login done!",
        "success": true
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
  return res.status(411).json({
    msg: "user not exist",
    "success": false
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.put("/", authmiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  try {
    await User.updateOne({ _id: req.userId }, req.body);

    return res.json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/bulk", async (req, res) => {
  // ? filter="jjj" ;
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  return res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
