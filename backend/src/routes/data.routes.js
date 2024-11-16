import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createData,
  deleteData,
  getData,
  updateData,
} from "../controllers/data.controller.js";

const router = Router();
router.use(verifyJWT);
router.route("/").post(createData).get(getData);
router.route("/:qaId").patch(updateData).delete(deleteData);

export default router;
