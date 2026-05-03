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
  sendLoginData,
  getToken,
  getId,
} from "./user.controller.js";
import { validateToken } from "./user.auth.js";

export const userRouter = Router();

userRouter.get("", findAll);
userRouter.get("/:id", findOne);
userRouter.get("/login/:id", sendLoginData);
userRouter.post("/", sanitizeInput, add);
userRouter.patch("/:id", sanitizeInput, validateToken, update);
userRouter.delete("/:id", validateToken, remove);
userRouter.get("/verify/:token", authenticateUser);
userRouter.post("/verify/", sanitizeInput, addAndVerify);
userRouter.post("/test/", getToken);
userRouter.get("/:email/:pass", getId);
