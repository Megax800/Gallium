import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  sanitizeInput,
  getPreview,
} from "./chatroom.controller.js";
import { validateToken } from "../user/user.auth.js";

export const chatroomRouter = Router();

chatroomRouter.get("", findAll);
chatroomRouter.get("/:id", findOne);
chatroomRouter.get("/preview/:id", getPreview);
chatroomRouter.post("/", sanitizeInput, add);
chatroomRouter.patch("/:id", sanitizeInput, validateToken, update);
chatroomRouter.delete("/:id", validateToken, remove);
