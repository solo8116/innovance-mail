import csv from "csvtojson";
import * as nodemailer from "nodemailer";
import { template } from "./template";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

let fileInputName = "input.csv";

async function main() {
  try {
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
  } catch (error) {
    console.log(error);
  }
}

main();
