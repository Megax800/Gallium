import { Router } from "express";

export const chatroomRouter = Router()

chatroomRouter.get('', (req, res) =>{res.send("Getting all chatrooms")})
chatroomRouter.get('/:id', (req, res) =>{res.send("Getting one chatroom")})
chatroomRouter.post('/', (req, res) =>{res.send("Posting a chatroom")})
chatroomRouter.put('/:id', (req, res) =>{res.send("Updating a chatroom")})
chatroomRouter.delete('/:id', (req, res) =>{res.send("Deleting a chatroom")})