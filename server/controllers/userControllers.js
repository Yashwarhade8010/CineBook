const { generateToken } = require("../middlewares/auth");
const { randomBytes, createHash } = require("crypto");
const User = require("../models/userSchema");
const ResetToken = require("../models/passwordResetToken");
const transporter = require("../utils/nodeMailer");

const handleRegister = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      return res
        .status(400)
        .json({ message: "Username or email is already taken" });
    }

    User.create({
      username,
      email,
      password,
    });
    return res.status(201).json({ message: "Register successfull" });
  } catch (err) {
    console.log(err);
  }
};

const handleLogin = async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      return res.status(400).json({ message: "User not exist" });
    }
    let verifyPass = await user.matchPassword(password);
    if (!verifyPass) {
      return res.status(401).json({ message: "Wrong Password" });
    }
    const userToPass = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = generateToken(userToPass);

    res.cookie("token", token, {
      httpOnlyL: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.log(err);
  }
};
const handleForgetPassword = async (req, res) => {
  const email = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email field should not be empty" });
  }
  const user = await User.findOne(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");
    await ResetToken.deleteMany({ userId: user._id });
    const token = await ResetToken.create({
      userId: user._id,
      hashedToken: hashedToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    const link = `http://localhost:4000/user/reset-passoword?token=${rawToken}&uid=${user._id}`;

    const message = await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: "Reset your password",
      text: `Click the link to reset your password ${link} This link expires in 1 hour.`,
    });

    return res.status(200).json({
      success: true,
      message: "If email exists then link is sent",
      data: message.messageId,
    });
  } catch (err) {
    console.error(err.message);
    throw new Error("Internal server problem");
  }
};

const handleChangePassword = async (req, res) => {
  const { token, uid } = req.query;
  const { newPassword } = req.body;
  if (!token || !uid) {
    return res.status(400).json({ message: "Bad request" });
  }
  try {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const resetRecord = await ResetToken.findOne({
      userId: uid,
      hashedToken: tokenHash,
    });
    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    if (resetRecord.used || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const user = await User.findById(uid);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.password = newPassword;
    await user.save();

    resetRecord.used = true;
    await resetRecord.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfull" });
  } catch (err) {
    console.error(err);
    throw new Error("Internal server problem");
  }
};

module.exports = {
  handleRegister,
  handleLogin,
  handleForgetPassword,
  handleChangePassword,
};
