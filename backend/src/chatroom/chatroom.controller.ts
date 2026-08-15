import { Request, Response, NextFunction } from "express";
import { getORM } from "../../shared/db/orm.js";
import { Chat } from "./chatroom.entity.js";
import { User } from "../user/user.entity.js";

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
    const orm = await getORM();
    const em = orm.em.fork();
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
    const orm = await getORM();
    const em = orm.em.fork();
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(
      Chat,
      { id },
      { populate: ["users", "messages", "admin"] },
    );
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function getPreview(req: Request, res: Response) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(
      Chat,
      { id },
      {
        populate: ["admin:ref", "users"],
        exclude: [
          "users.email",
          "users.firstname",
          "users.lastname",
          "users.passwd",
          "chatname",
          "isGroup",
        ],
      },
    );
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();
    const chat = new Chat();

    const users = await em.find(User, {
      email: { $in: req.body.sanitizeInput.users },
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
    if (!chat.isGroup) {
      chat.chatname = users[1].nickname;
    }
    return res.status(201).json({ id: chat.id, chatname: chat.chatname });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();
    const id: any = req.params.id;
    const { users, admin, ...data } = req.body.sanitizeInput ?? {};
    const buffer = await em.findOneOrFail(Chat, { id });
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.id != (await buffer).admin._id?.toString()) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    em.assign(buffer, data);
    if (users) {
      buffer.users.set(await em.find(User, { email: { $in: users } }));
    }

    if (admin) {
      buffer.admin = await em.getReference(User, admin);
    }
    await em.flush();
    res.status(200).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function updateChatname(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const { users, admin, ...data } = req.body.sanitizeInput ?? {};
    const buffer = await em.findOneOrFail(Chat, { id });
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.id != (await buffer).admin._id?.toString()) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    em.assign(buffer, data);
    if (users) {
      buffer.users.set(await em.find(User, { id: { $in: users } }));
    }

    if (admin) {
      buffer.admin = await em.getReference(User, admin);
    }
    await em.flush();
    res.status(200).json(buffer.chatname);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function addUsers(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const { users, admin, ...data } = req.body.sanitizeInput ?? {};
    const buffer = await em.findOneOrFail(
      Chat,
      { id },
      { populate: ["users"] },
    );
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.id != (await buffer).admin._id?.toString()) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    em.assign(buffer, data);
    if (users) {
      buffer.users.add(await em.find(User, { email: { $in: users } }));
    }

    if (admin) {
      buffer.admin = await em.getReference(User, admin);
    }
    await em.flush();
    const result = buffer.users.getItems().map((user) => ({
      id: user.id,
      nickname: user.nickname,
    }));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function removeUsers(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const { users, admin, ...data } = req.body.sanitizeInput ?? {};
    const buffer = await em.findOneOrFail(
      Chat,
      { id },
      { populate: ["users"] },
    );
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.id != (await buffer).admin._id?.toString()) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    em.assign(buffer, data);
    if (users) {
      const userToRemove = buffer.users
        .getItems()
        .find((user) => users.includes(user.id));
      if (userToRemove) {
        buffer.users.remove(userToRemove);
      }
    }

    if (admin) {
      buffer.admin = await em.getReference(User, admin);
    }
    await em.flush();
    const result = buffer.users.getItems().map((user) => ({
      id: user.id,
      nickname: user.nickname,
    }));
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(Chat, id);
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.id != (await buffer).admin._id?.toString()) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    await em.remove(buffer);
    await em.flush();
    res
      .status(200)
      .json({ message: `Chat ${(await buffer).id} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export {
  sanitizeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  getPreview,
  updateChatname,
  addUsers,
  removeUsers,
};
