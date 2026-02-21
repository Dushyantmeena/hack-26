import User from '../models/user.model.js';
import { handleError } from '../helpers/handleError.js';

// ✅ Get User (Public/Protected)
export const getUser = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const user = await User.findById(userid)
      .select("-password -otp -otpExpires") // Exclude sensitive info
      .lean()
      .exec();

    if (!user) {
      return next(handleError(404, 'User not found.'));
    }

    res.status(200).json({
      success: true,
      message: 'User details retrieved successfully',
      user
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Update User (Protected)
export const updateUser = async (req, res, next) => {
  try {
    // Check if user is trying to update someone else's account
    // (req.user is added by verifyToken middleware)
    if (req.user._id !== req.user._id) { 
       return next(handleError(401, "You can only update your own account!"));
    }
    
    const { name, bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      {
        $set: {
          name: name,
          bio: bio,
        },
      },
      { new: true } // Return the updated document
    );

    // Remove password from response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: rest,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Delete User (Protected)
export const deleteUser = async (req, res, next) => {
  try {
    // Check if user is deleting their own account
    if (req.user._id !== req.user._id) {
       return next(handleError(401, "You can only delete your own account!"));
    }

    await User.findByIdAndDelete(req.user._id);
    
    // Clear cookie
    res.clearCookie("access_token");
    
    res.status(200).json({
      success: true,
      message: "User has been deleted.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};