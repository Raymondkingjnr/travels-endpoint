import nodemailer from "nodemailer";
import { GMAIL_PASS, GMAIL_USER } from "./env.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
});

export default transporter;
