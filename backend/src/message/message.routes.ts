import { Router } from "express";
import {
  sanitizeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  messagesLastN,
} from "./message.controller.js";
export const messageRouter = Router();

messageRouter.get("", findAll);
messageRouter.get("/:id", findOne);
messageRouter.get("/chat/:id/:num", messagesLastN);
messageRouter.post("/", sanitizeInput, add);
messageRouter.put("/:id", sanitizeInput, update);
messageRouter.delete("/:id", remove);
