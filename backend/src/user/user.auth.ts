import mailer from "nodemailer";
import jwt from "jsonwebtoken";
import { User } from "./user.entity";
import { NextFunction, Request, Response } from "express";
/*TO DO
- Plantear un token seguro y una mejor contraseña para el correo
*/
const secret_key = `${process.env.JWT_KEY}`;

async function sendVerification(newUser: User) {
  const transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const token = jwt.sign({ data: newUser }, secret_key, { expiresIn: "10m" });

  const mailBody = {
    from: process.env.MAIL_USER,
    to: newUser.email,
    subject: "Te damos la bienvenida a Gallium",
    text: `Hola!, para poder terminar el proceso de registro de tu nueva cuenta de Gallium accede la siguiente enlace: http://localhost:3000/api/user/verify/${token}`,
  };

  transporter.sendMail(mailBody, (error, info) => {
    if (error) throw Error(error.toString());
    console.log(`Verification mail sent to ${info.envelope.to}`);
  });
}

async function verifyData(token: string) {
  try {
    const decode = jwt.verify(token, secret_key);
    return JSON.stringify({ success: true, decode });
  } catch (err) {
    return JSON.stringify({ success: false, err });
  }
}

async function validateToken(req: Request, res: Response, next: NextFunction) {
  if (process.env.ENCRYPT_REQUESTS == "true") {
    const authHeader = req.headers.authorization;
    req.body = req.body || {};
    if (!authHeader) {
      return res.status(403).send({ message: "Empty token" });
    } else {
      try {
        const token = authHeader.split(" ")[1];
        const token_value = jwt.verify(token, secret_key);
        req.body.user = token_value;
      } catch (err: any) {
        return res.status(403).send({
          message: `Cannot proceed with operation. Reason: ${err.message}`,
        });
      }
    }
  }
  next();
}

async function generateTokenFromObject(objectToToken: any) {
  const token = jwt.sign({ id: objectToToken }, secret_key, {
    expiresIn: "72h",
  });
  return token;
}

export { sendVerification, verifyData, validateToken, generateTokenFromObject };
