import mailer from "nodemailer";
import jwt from "jsonwebtoken";
import { User } from "./user.entity";
/*TO DO
- Plantear un token seguro y una mejor contraseña para el correo
- Definir variables de entorno para guardar las contraseñas y datos sensibles de forma segura
*/
async function sendVerification(newUser: User) {
  const transporter = mailer.createTransport({
    host: "mail15.serv00.com",
    port: 465,
    secure: true,
    auth: {
      user: "galliumuserverification@coolair.serv00.net",
      pass: `Gallium2026`,
    },
  });

  const token = jwt.sign({ data: newUser }, "12345678", { expiresIn: "10m" });

  const mailBody = {
    from: "galliumuserverification@coolair.serv00.net",
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
    const decode = jwt.verify(token, "12345678");
    return JSON.stringify({ success: true, decode });
  } catch (err) {
    return JSON.stringify({ success: false, err });
  }
}

export { sendVerification, verifyEmail };
