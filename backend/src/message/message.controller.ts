import { messageRepository } from "./message.repository.js";
import { Request, Response, NextFunction } from "express";
import { Message } from "./message.entity.js";

const repository = new messageRepository()

function sanitizeInput( req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput={
        body: req.body.body,
        sender: req.body.sender,
        receiver: req.body.receiver
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
        return res.status(404).send({message: "message not Found"})
    }
    res.json({data: buffer})
}

async function add(req: Request, res: Response){
    const input = req.body.sanitizeInput
    const timestamp = new Date()

    const buffer = new Message(
        input.body,
        timestamp.toLocaleDateString(),
        timestamp.toLocaleTimeString(),
        input.sender,
        input.receiver
    )

    const message = await repository.add(buffer)
    res.status(201).send({message: "message Created", data: message})
}

async function update(req: Request, res: Response){
    const buffer = await repository.update(req.params.id.toString(), req.body.sanitizeInput)
    if(!buffer){
        return res.status(404).send({message: "message not Found"})
    }
    res.status(200).send({message: "message updated successfully", data: buffer})
}

async function remove(req: Request, res: Response){
    const id = req.params.id.toString()
    const buffer = await repository.delete({id})
    if(!buffer){
        return res.status(404).send({message: "message not Found"})
    }
    res.status(200).send({message: "message deleted successfully"})
}
export{sanitizeInput, findAll, findOne, add, update, remove}