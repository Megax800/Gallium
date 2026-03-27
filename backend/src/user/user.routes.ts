import { Router } from "express";
import {
  sanitizeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  authenticateUser,
  addAndVerify,
} from "./user.controller.js";

export const userRouter = Router();

userRouter.get("", findAll);
userRouter.get("/:id", findOne);
userRouter.post("/", sanitizeInput, add);
userRouter.put("/:id", sanitizeInput, update);
userRouter.delete("/:id", remove);
userRouter.get("/verify/:token", authenticateUser);
userRouter.post("/verify/", sanitizeInput, addAndVerify);
