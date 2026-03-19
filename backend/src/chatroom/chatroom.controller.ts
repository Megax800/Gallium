import { chatroomRepository } from "./chatroom.repository.js";
import { Request, Response, NextFunction } from "express";
import { Chatroom } from "./chatroom.entity.js";

const repository = new chatroomRepository()

function sanitizeInput( req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput={
        admin: req.body.admin,
        chatname: req.body.chatname,
        isGroup: req.body.isGroup,
        desc: req.body.description
    }
    //more checks here
  
    Object.keys(req.body.sanitizeInput).forEach((key) => {
      if (req.body.sanitizeInput[key] === undefined) {
        delete req.body.sanitizeInput[key]
      }
    })
    next()
  }

async function findAll(req: Request, res: Response){
    res.json({data: await repository.findAll()})
}

async function findOne(req: Request, res: Response){
    const id = req.params.id.toString()
    const buffer = await repository.findOne({id})
    if(!buffer){
        return res.status(404).send({message: "Chatroom not Found"})
    }
    res.json({data: buffer})
}

async function add(req: Request, res: Response){
    const input = req.body.sanitizeInput

    const buffer = new Chatroom(
        input.admin,
        input.chatname,
        input.isGroup,
        input.desc
    )

    const chatroom = await repository.add(buffer)
    res.status(201).send({message: "Chatroom Created", data: chatroom})
}

async function update(req: Request, res: Response){
    const buffer = await repository.update(req.params.id.toString(), req.body.sanitizeInput)
    if(!buffer){
        return res.status(404).send({message: "Chatroom not Found"})
    }
    res.status(200).send({message: "Chatroom updated successfully", data: buffer})
}

async function remove(req: Request, res: Response){
    const id = req.params.id.toString()
    const buffer = await repository.delete({id})
    if(!buffer){
        return res.status(404).send({message: "Chatroom not Found"})
    }
    res.status(200).send({message: "Chatroom deleted successfully"})
}
export{sanitizeInput, findAll, findOne, add, update, remove}