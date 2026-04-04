import { Request, Response, NextFunction } from "express";
import { Message } from "./message.entity.js";
import { orm } from "../../shared/db/orm.js";
import { Chat } from "../chatroom/chatroom.entity.js";

const em = orm.em;

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    body: req.body.body,
    sender: req.body.sender,
    receiver: req.body.receiver,
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
    const messages = await em.find(Message, {});
    res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(Message, { id });
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function messagesLastN(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const results = Number(req.params.num);
    const messages = await em.find(
      Message,
      {
        receiver: id,
      },
      { exclude: ["receiver"], orderBy: { id: "desc" }, limit: results },
    );
    res.status(200).json(messages);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const today = new Date();
    const buffer = em.create(Message, req.body);
    buffer.date = today.toLocaleDateString();
    buffer.time = today.toLocaleTimeString();
    await em.flush();
    res.status(201).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = em.getReference(Message, id);
    em.assign(buffer, req.body);
    await em.flush();
    res.status(200).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = em.getReference(Message, id);
    await em.remove(buffer);
    await em.flush();
    res.status(200).json({ message: `Message ${buffer} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export { sanitizeInput, findAll, findOne, add, update, remove, messagesLastN };
