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
        message: "user already existed this email",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashPass,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("error in reg",error)
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
        message: "user not found",
      });
    }
    let checkPass = await bcrypt.compare(password, isExist.password);
    if (!checkPass) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: isExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.status(200).json({
      message: "Login successful",
        user: isExist,
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

let forgetPasswordController = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email)
      return res.status(404).json({
        message: "Email not found",
      });

    let isExisted = await UserModel.findOne({ email });

    if (!isExisted)
      return res.status(404).json({
        message: "User not found with this email",
      });

    let rawToken = jwt.sign({ id: isExisted._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    let resetLink = `http://localhost:3000/api/auth/reset-password/${rawToken}`;

    await sendMailTo(
      email,
      "reset password",
      `<a href='${resetLink}'> click here</a>`,
    );

    return res.status(200).json({
      message: "Reset link sent",
    });
  } catch (error) {
    console.log("error in fp api", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

let resetPasswordController = async (req, res) => {
  try {
    let token = req.params.token;

    if (!token)
      return res.status(400).json({
        message: "Invalid request",
      });

    let decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode)
      return res.status(401).json({
        message: "Unauthorized request",
      });

    let user = await UserModel.findById(decode.id);

    if (!user)
      return res.status(401).json({
        message: "Unauthorized request",
      });

    return res.render("reset.ejs", { id: user._id });
  } catch (error) {
    console.log("error in fp api", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
let updatePasswordController = async (req, res) => {
  try {
    let userId = req.params.userId;

    if (!userId)
      return res.status(400).json({
        message: "Invalid request",
      });

    let { password } = req.body;

    if (!password)
      return res.status(400).json({
        message: "Invalid request",
      });

    let hashPass = await bcrypt.hash(password, 10);

    let updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashPass,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("error in UP api", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  resetPasswordController,
  forgetPasswordController,
  updatePasswordController,
};
