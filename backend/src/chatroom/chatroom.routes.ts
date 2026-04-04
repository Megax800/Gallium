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

export const chatroomRouter = Router();

chatroomRouter.get("", findAll);
chatroomRouter.get("/:id", findOne);
chatroomRouter.get("/preview/:id", getPreview);
chatroomRouter.post("/", sanitizeInput, add);
chatroomRouter.put("/:id", sanitizeInput, update);
chatroomRouter.delete("/:id", remove);
