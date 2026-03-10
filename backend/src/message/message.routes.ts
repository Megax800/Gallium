import { Router } from "express";

export const messageRouter = Router()

messageRouter.get('', (req, res) =>{res.send("Getting all messages")})
messageRouter.get('/:id', (req, res) =>{res.send("Getting one message")})
messageRouter.post('/', (req, res) =>{res.send("Posting a message")})
messageRouter.put('/:id', (req, res) =>{res.send("Updating a message")})
messageRouter.delete('/:id', (req, res) =>{res.send("Deleting a message")})