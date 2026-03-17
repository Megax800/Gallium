import { Router } from "express";
import {sanitizeInput, findAll, findOne, add, update, remove} from "./user.controller.js";

export const userRouter = Router()

userRouter.get('', findAll)
userRouter.get('/:id', findOne)
userRouter.post('/', sanitizeInput, add)
userRouter.put('/:id', sanitizeInput, update)
userRouter.delete('/:id', remove)