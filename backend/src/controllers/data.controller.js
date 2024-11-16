import { Data } from "../models/data.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createData = asyncHandler(async (req, res) => {
  const { question, answer, country } = req.body;
  const user = req.user;

  if ([question, answer, country].some((field) => field?.trim() === ""))
    throw new ApiError(400, "Question, answer, and country are required");

  if (user.role === "Viewer" && country !== user.country) {
    throw new ApiError(
      403,
      "Viewers can only create Q&A entries for their assigned country"
    );
  }

  const data = await Data.create({
    question,
    answer,
    country,
    createdBy: user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, data, "Data created successfully"));
});

const getData = asyncHandler(async (req, res) => {
  const user = req.user;
  const { country } = req.body;

  if (user.role === "Viewer" && country !== user.country) {
    throw new ApiError(
      403,
      "You can only view Q&As from your assigned country"
    );
  }

  const data = await Data.find({ country })
    .populate("createdBy", "username role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, qas, `Data retrieved successfully for ${country}`)
    );
});

const updateData = asyncHandler(async (req, res) => {
  const { qaId } = req.params;
  const { question, answer, country } = req.body;
  const user = req.user;

  if (user.role !== "Admin") {
    throw new ApiError(403, "Only admins can update Q&As");
  }

  if ([question, answer, country].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Question, answer, and country are required");
  }

  const updatedData = await Data.findByIdAndUpdate(
    qaId,
    {
      $set: {
        question,
        answer,
        country,
        updatedAt: Date.now(),
      },
    },
    { new: true }
  );

  if (!updatedData) throw new ApiError(404, "Q&A not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedData, "Q&A updated successfully"));
});

const deleteData = asyncHandler(async (req, res) => {
  const { qaId } = req.params;
  const user = req.user;

  if (user.role !== "Admin")
    throw new ApiError(403, "Only admins can delete Q&As");

  const deletedData = await Data.findByIdAndDelete(qaId);

  if (!deletedData) {
    throw new ApiError(404, "Q&A not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Q&A deleted successfully"));
});

export { createData, getData, updateData, deleteData };
