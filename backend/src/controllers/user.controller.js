import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken };
  } catch (err) {
    throw new Error(500, "Error generating access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, role, country } = req.body;

  if ([username, password, role].some((field) => field?.trim() === ""))
    throw new ApiError(400, "All fields are required");

  if (!["Admin", "Viewer"].includes(role))
    throw new ApiError(400, "Role must be Admin or Viewer");

  if (role === "Viewer" && !country)
    throw new ApiError(400, "Country is required for viewers");

  const existingUser = await User.findOne({ username });
  if (existingUser) throw new ApiError(409, "User already exists");

  const user = new User({
    username,
    password,
    role,
    country: role === "Viewer" ? country : undefined,
  });

  await user.save();

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if ([username, password].some((field) => field?.trim() === ""))
    throw new ApiError(400, "Username and password are required");

  const user = await User.findOne({ username });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credidentials");

  const { accessToken } = await generateAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          username: user.username,
          role: user.role,
          country: user.role === "Viewer" ? user.country : undefined,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        accessToken: 1,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
