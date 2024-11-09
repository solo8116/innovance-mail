import csv from "csvtojson";
import * as nodemailer from "nodemailer";
import { template } from "./template";
import express, { Request, Response } from "express";
import "dotenv/config";

const app = express();

const PORT: number = parseInt(process.env.PORT as string) || 3000;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

app.post("/sendBulk", async (req: Request, res: Response) => {
  try {
    await sendBulk();
    res.status(200).json({
      success: true,
      message: "bulk mail send successfully",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "failed to send mail",
    });
  }
});

app.post("/sendSingle", async (req: Request, res: Response) => {
  try {
    const { email, uid } = req.body;
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "",
      html: template(uid),
    });
    res.status(200).json({
      success: true,
      message: "mail send successfully",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "failed to send mail",
    });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

let fileInputName = "input.csv";

async function sendBulk() {
  const jsonObj: { uid: string; email: string }[] = await csv().fromFile(
    fileInputName
  );
  console.log(jsonObj);
  await Promise.all(
    jsonObj.map(async (obj: { uid: string; email: string }) => {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: obj.email,
        subject: "",
        html: template(obj.uid),
      });
    })
  );
}
