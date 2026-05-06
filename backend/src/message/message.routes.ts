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
import { validateToken } from "../user/user.auth.js";
export const messageRouter = Router();

messageRouter.get("", findAll);
messageRouter.get("/:id", findOne);
messageRouter.get("/chat/:id/:num", messagesLastN);
messageRouter.post("/", sanitizeInput, add);
messageRouter.patch("/:id", sanitizeInput, validateToken, update);
messageRouter.delete("/:id", validateToken, remove);
