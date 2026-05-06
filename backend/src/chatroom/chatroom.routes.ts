import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  sanitizeInput,
  getPreview,
  updateChatname,
  addUsers,
  removeUsers,
} from "./chatroom.controller.js";
import { validateToken } from "../user/user.auth.js";

export const chatroomRouter = Router();

chatroomRouter.get("", findAll);
chatroomRouter.get("/:id", findOne);
chatroomRouter.get("/preview/:id", getPreview);
chatroomRouter.post("/", sanitizeInput, add);
chatroomRouter.patch("/:id", sanitizeInput, validateToken, update);
chatroomRouter.delete("/:id", validateToken, remove);
chatroomRouter.patch(
  "/chatname/:id",
  sanitizeInput,
  validateToken,
  updateChatname,
);
chatroomRouter.patch("/addUsers/:id", sanitizeInput, validateToken, addUsers);
chatroomRouter.patch(
  "/removeUser/:id",
  sanitizeInput,
  validateToken,
  removeUsers,
);
