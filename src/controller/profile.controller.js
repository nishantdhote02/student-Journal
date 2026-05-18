const bcrypt = require("bcrypt");
const UserModel = require("../model/user.model");

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select(
      "-password"
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};