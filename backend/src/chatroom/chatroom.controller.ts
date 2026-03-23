import { Request, Response, NextFunction } from "express";
import { orm } from "../../shared/db/orm.js";
import { Group, Chat } from "./chatroom.entity.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    admin: req.body.admin,
    chatname: req.body.chatname,
    isGroup: req.body.isGroup,
    description: req.body.description,
  };
  //more checks here

  Object.keys(req.body.sanitizeInput).forEach((key) => {
    if (req.body.sanitizeInput[key] === undefined) {
      delete req.body.sanitizeInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const chatrooms = await em.find(
      Chat,
      {},
      { populate: ["users", "messages"] },
    );
    res.status(200).json(chatrooms);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(
      Chat,
      { id },
      { populate: ["users", "messages"] },
    );
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    if (req.body.sanitizeInput.isGroup) {
      const buffer = em.create(Group, req.body.sanitizeInput);
      await em.flush();
      res.status(201).json({ data: buffer });
    } else {
      const buffer = em.create(Chat, req.body.sanitizeInput);
      await em.flush();
      res.status(201).json({ data: buffer });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(Chat, { id });
    em.assign(buffer, req.body.sanitizeInput);
    await em.flush();
    res.status(200).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = em.getReference(Chat, id);
    await em.remove(buffer);
    await em.flush();
    res.status(200).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export { sanitizeInput, findAll, findOne, add, update, remove };
