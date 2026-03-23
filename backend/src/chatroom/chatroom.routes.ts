import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  sanitizeInput,
} from "./chatroom.controller.js";

export const chatroomRouter = Router();

chatroomRouter.get("", findAll);
chatroomRouter.get("/:id", findOne);
chatroomRouter.post("/", sanitizeInput, add);
chatroomRouter.put("/:id", sanitizeInput, update);
chatroomRouter.delete("/:id", remove);
