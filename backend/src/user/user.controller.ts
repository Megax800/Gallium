import { userRepository } from "./user.repository.js";
import { Request, Response, NextFunction } from "express";
import { User } from "./user.entity.js";

const repository = new userRepository()

function sanitizeInput( req: Request, res: Response, next: NextFunction) {
    req.body.sanitizeInput={
        nickname: req.body.nickname,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        passwd: req.body.passwd
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
        return res.status(404).send({message: "User not Found"})
    }
    res.json({data: buffer})
}

async function add(req: Request, res: Response){
    const input = req.body.sanitizeInput

    const buffer = new User(
        input.nickname,
        input.firstname,
        input.lastname,
        input.email,
        input.passwd
    )

    const user = await repository.add(buffer)
    res.status(201).send({message: "User Created", data: user})
}

async function update(req: Request, res: Response){
    const buffer = await repository.update(req.params.id.toString(), req.body.sanitizeInput)
    if(!buffer){
        return res.status(404).send({message: "User not Found"})
    }
    res.status(200).send({message: "User updated successfully", data: buffer})
}

async function remove(req: Request, res: Response){
    const id = req.params.id.toString()
    const buffer = await repository.delete({id})
    if(!buffer){
        return res.status(404).send({message: "User not Found"})
    }
    res.status(200).send({message: "User deleted successfully"})
}
export{sanitizeInput, findAll, findOne, add, update, remove}