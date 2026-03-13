import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export async function sendEmail({ to, subject, html, attachments = [] }: { 
  to: string; 
  subject: string; 
  html: string;
  attachments?: any[];
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zeptomail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "emailapikey",
        pass: process.env.SMTP_PASS || process.env.ZEPTOMAIL_TOKEN || "",
      },
    });

    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
    let logoBase64 = "";
    try {
      logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    } catch (e) {
      console.warn("Could not load logo for email:", e);
    }

    // Prepare attachments for nodemailer
    const mailAttachments = [
      ...(logoBase64 ? [{
        filename: 'logo.png',
        content: logoBase64,
        encoding: 'base64',
        cid: 'logo'
      }] : []),
      ...attachments.map(att => ({
        filename: att.filename,
        content: att.content || (att.path ? fs.readFileSync(att.path) : ""),
        contentType: att.contentType,
        cid: att.cid
      }))
    ];

    const mailOptions = {
      from: `"${process.env.ZEPTOMAIL_FROM_NAME || 'Example Team'}" <${process.env.SMTP_FROM || 'noreply@rootedrising.org.ng'}>`,
      to,
      subject,
      html,
      attachments: mailAttachments
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, data: info };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

