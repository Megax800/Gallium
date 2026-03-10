import { Router } from "express";

export const userRouter = Router()

userRouter.get('', (req, res) =>{res.send("Getting all users")})
userRouter.get('/:id', (req, res) =>{res.send("Getting one user")})
userRouter.post('/', (req, res) =>{res.send("Posting a user")})
userRouter.put('/:id', (req, res) =>{res.send("Updating a user")})
userRouter.delete('/:id', (req, res) =>{res.send("Deleting a user")})