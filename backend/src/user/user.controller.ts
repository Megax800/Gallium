import { Request, Response, NextFunction } from "express";
import { User } from "./user.entity.js";
import { orm } from "../../shared/db/orm.js";
import { sendVerification, verifyEmail } from "./user.auth.js";

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
    const users = await em.find(User, {});
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = await em.findOneOrFail(User, { id });
    res.status(200).json(buffer);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function addAndVerify(req: Request, res: Response) {
  const input = req.body.sanitizeInput;
  const buffer = new User();
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
}

async function add(req: Request, res: Response) {
  try {
    const buffer = em.create(User, req.body);
    await em.flush();
    res.status(201).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id: any = req.params.id;
    const buffer = em.getReference(User, id);
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
    const buffer = em.getReference(User, id);
    await em.remove(buffer);
    await em.flush();
    res.status(200).json({ data: buffer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

async function authenticateUser(req: Request, res: Response) {
  const result = JSON.parse(await verifyEmail(req.params.token.toString()));

  if (result.success) {
    try {
      em.create(User, result.decode.data);
      await em.flush();
      res.status(201).send({
        message: "User Created Successfully",
        data: result.decode.data,
      });
    } catch (err: any) {
      res.status(500).send({ message: err.message });
    }
  } else {
    res.status(500).send({ message: "Oops!, what happened", data: result.err });
  }
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
};
