import { Request, Response, NextFunction } from "express";
import { orm } from "../../shared/db/orm.js";
import { Chat } from "./chatroom.entity.js";
import { User } from "../user/user.entity.js";

const em = orm.em;

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    admin: req.body.admin,
    chatname: req.body.chatname,
    isGroup: req.body.isGroup,
    description: req.body.description,
    users: req.body.users,
    messages: req.body.messages,
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
      { populate: ["users:ref", "messages:ref"] },
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
      { populate: ["users:ref", "messages:ref", "admin:ref"] },
    );
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const chat = new Chat();

    const users = await em.find(User, {
      id: { $in: req.body.sanitizeInput.users },
    });

    chat.users.add(users);
    chat.isGroup = req.body.sanitizeInput.isGroup;
    if (req.body.sanitizeInput.isGroup) {
      chat.chatname = req.body.sanitizeInput.chatname;
      chat.description = req.body.sanitizeInput.description;
      chat.admin = await em.getReference(User, req.body.sanitizeInput.admin);
    }

    em.persist(chat);
    await em.flush();
    return res.status(201).send(chat);
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
    res.status(200).json({ message: `Chat ${buffer.id} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export { sanitizeInput, findAll, findOne, add, update, remove };
