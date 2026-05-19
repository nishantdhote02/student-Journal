const UserModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let registerController = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let isExistingUser = await UserModel.findOne({ email });

    if (isExistingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashPass,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    console.log("error in register", error);

    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

let loginController = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let isExist = await UserModel.findOne({ email });

    if (!isExist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let checkPass = await bcrypt.compare(password, isExist.password);

    if (!checkPass) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: isExist._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Login successful",
      user: isExist,
      token,
    });
  } catch (error) {
    console.log("error in login", error);

    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

let logoutController = (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging out",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
};