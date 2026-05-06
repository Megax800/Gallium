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

export const chatroomRouter = Router();

chatroomRouter.get("", findAll);
chatroomRouter.get("/:id", findOne);
chatroomRouter.get("/preview/:id", getPreview);
chatroomRouter.post("/", sanitizeInput, add);
chatroomRouter.patch("/:id", sanitizeInput, update);
chatroomRouter.delete("/:id", remove);
chatroomRouter.patch("/chatname/:id", sanitizeInput, updateChatname);
chatroomRouter.patch("/addUsers/:id", sanitizeInput, addUsers);
chatroomRouter.patch("/removeUser/:id", sanitizeInput, removeUsers);
