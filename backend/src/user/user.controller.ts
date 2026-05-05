import { Request, Response, NextFunction } from "express";
import { User } from "./user.entity.js";
import { getORM } from "../../shared/db/orm.js";
import {
  generateTokenFromObject,
  sendVerification,
  verifyData,
} from "./user.auth.js";
import { validateOrReject } from "class-validator";
import { Chat } from "../chatroom/chatroom.entity.js";

const orm = await getORM();
const em = orm.em;

function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizeInput = {
    nickname: req.body.nickname,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    passwd: req.body.passwd,
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
    const users = await em.find(
      User,
      {},
      { populate: ["chatrooms", "messages"] },
    );
    res.status(200).send(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function sendLoginData(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const user = await em.findOneOrFail(
      User,
      { id },
      {
        populate: ["chatrooms", "chatrooms.users"],
        exclude: ["passwd", "chatrooms.admin", "chatrooms.description"],
      },
    );
    const result = {
      id: user.id,
      nickname: user.nickname,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      chatrooms: user.chatrooms.getItems().map((chat) => {
        const chatUsers = chat.users.getItems();

        let chatname = chat.chatname;

        if (!chat.isGroup) {
          const otherUser = chatUsers.find((u) => u.id !== user.id);
          chatname = otherUser?.nickname;
        }

        return { id: chat.id, chatname };
      }),
    };

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(
      User,
      { id },
      { populate: ["chatrooms", "messages"] },
    );
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function getId(req: Request, res: Response) {
  try {
    const user = await em.findOne(User, {
      email: req.body.sanitizeInput.email,
    });
    if (user != undefined) {
      if (user.passwd != req.body.sanitizeInput.passwd) {
        throw Error("Password not match");
      } else {
        const token = generateTokenFromObject(req.body);
        return res.status(200).json({ data: (await token).toString() });
      }
    } else {
      throw Error(`User with email ${req.body.sanitizeInput.email} dont exist`);
    }
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
}

//Agregar validacion de correo unico
async function addAndVerify(req: Request, res: Response) {
  try {
    const input = req.body.sanitizeInput;
    const buffer = new User();
    //await validateOrReject(buffer);
    buffer.nickname = input.nickname;
    buffer.firstname = input.firstname;
    buffer.lastname = input.lastname;
    buffer.passwd = input.passwd;
    buffer.email = input.email;

    await sendVerification(buffer);
    res.status(200).json({
      message:
        "A verification email was sent, check your inbox and follow instructions",
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const checkEmail = await em.find(User, {
      email: req.body.sanitizeInput.email,
    });
    if (checkEmail.length > 0) {
      throw new Error("Email already registered");
    }
    const buffer = em.create(User, req.body);
    await validateOrReject(buffer, { validationError: { target: false } });
    await em.flush();
    res.status(201).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ OrmError: err.message, ValidationError: err });
  }
}

async function update(req: Request, res: Response) {
  try {
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.data.id != req.params.id) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    const id: any = req.params.id;
    const { chatrooms, messages, ...data } = req.body.sanitizeInput ?? {};
    const buffer = await em.findOneOrFail(User, id, {
      populate: ["chatrooms", "messages"],
    });
    em.assign(buffer, data);
    if (chatrooms) {
      buffer.chatrooms.set(await em.find(Chat, { id: { $in: chatrooms } }));
    }

    if (messages) {
      buffer.chatrooms.set(await em.find(Chat, { id: { $in: messages } }));
    }
    await em.flush();
    res.status(200).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    if (process.env.ENCRYPT_REQUESTS == "true") {
      if (req.body.user.data.id != req.params.id) {
        throw Error(
          "The user don't have privileges to do the current operation",
        );
      }
    }
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(User, id);
    await em.remove(buffer);
    await em.flush();
    res
      .status(200)
      .json({ message: `User ${(await buffer).id} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function authenticateUser(req: Request, res: Response) {
  const result = JSON.parse(await verifyData(req.params.token.toString()));

  if (result.success) {
    try {
      em.create(User, result.decode.data);
      await em.flush();
      res.redirect(301, `http://localhost:4200/login/`);
    } catch (err: any) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res
      .status(500)
      .send({ message: "Authentication Failed", data: result.err });
  }
}

async function getToken(req: Request, res: Response) {
  const token = generateTokenFromObject(req.body);
  return res
    .status(200)
    .json({ input: req.body, output: (await token).toString() });
}

export {
  sanitizeInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  authenticateUser,
  addAndVerify,
  sendLoginData,
  getToken,
  getId,
};
