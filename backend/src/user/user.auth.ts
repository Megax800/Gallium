import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { User } from "./user.entity";
import { NextFunction, Request, Response } from "express";
/*TO DO
- Plantear un token seguro y una mejor contraseña para el correo
*/
const secret_key = `${process.env.JWT_KEY}`;
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerification(newUser: User) {
  const token = jwt.sign({ data: newUser }, secret_key, { expiresIn: "10m" });

  const mailBody = {
    from: "Gallium <onboarding@resend.dev>",
    to: newUser.email,
    subject: "Te damos la bienvenida a Gallium",
    text: `Hola!, para poder terminar el proceso de registro de tu nueva cuenta de Gallium accede la siguiente enlace: ${process.env.BACKEND_URL}/api/user/verify/${token}`,
  };

  const { data, error } = await resend.emails.send(mailBody);

  if (error) {
    console.error("Error sending verification email:", error);
    throw new Error(error.message);
  }

  console.log(`Verification mail sent. ID: ${data?.id}`);
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
