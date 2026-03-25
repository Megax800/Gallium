import mailer from "nodemailer";
import jwt from "jsonwebtoken";
import { User } from "./user.entity";
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
    console.log("Mail Sent");
    console.log(info);
  });
}

async function verifyEmail(token: string) {
  try {
    const decode = jwt.verify(token, secret_key);
    return JSON.stringify({ success: true, decode });
  } catch (err) {
    return JSON.stringify({ success: false, err });
  }
}

export { sendVerification, verifyEmail };
