import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

/**
 * Initialize Nodemailer transport for ZeptoMail
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zeptomail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // usually false for 587
  auth: {
    user: process.env.SMTP_USER || "emailapikey",
    pass: process.env.SMTP_PASS || process.env.ZEPTOMAIL_TOKEN || "",
  },
});

export async function sendEmail({ 
  to, 
  subject, 
  html, 
  attachments = [] 
}: { 
  to: string | string[]; 
  subject: string; 
  html: string;
  attachments?: any[];
}) {
  try {
    const fromAddress = process.env.ZEPTOMAIL_FROM_ADDRESS || process.env.SMTP_FROM || "noreply@rootedrising.org.ng";
    const fromName = process.env.ZEPTOMAIL_FROM_NAME || "Rooted Rising Initiative";

    // Standardize 'to' for Nodemailer (can be a comma separated string or array)
    const recipients = Array.isArray(to) ? to.join(",") : to;

    // Handle branding logo
    const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
    let logoBase64 = "";
    try {
      logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    } catch (e) {
      // Silently fail if logo cannot be loaded
    }

    // Prepare attachments for nodemailer
    const mailAttachments = [
      ...(logoBase64 && html.includes("cid:logo") ? [{
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
      from: `"${fromName}" <${fromAddress}>`,
      to: recipients,
      subject,
      html,
      attachments: mailAttachments
    };

    const info = await transporter.sendMail(mailOptions);

    return { success: true, data: info };
  } catch (error) {
    console.error("Email delivery error:", error);
    return { success: false, error };
  }
}

/**
 * Convenience method for newsletter bulk sending using SMTP
 */
export async function sendBulkEmail({
  emails,
  subject,
  html
}: {
  emails: string[];
  subject: string;
  html: string;
}) {
  // SMTP usually prefers individual sends or specific headers for bulk
  // We'll chunk to avoid overwhelming the connection or hitting rate limits
  const CHUNK_SIZE = 50; 
  let successCount = 0;
  
  for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
    const chunk = emails.slice(i, i + CHUNK_SIZE);
    
    // For SMTP, sending many individual emails in parallel is often faster
    const promises = chunk.map(email => 
      sendEmail({
        to: email,
        subject,
        html
      })
    );
    
    const results = await Promise.all(promises);
    successCount += results.filter(r => r.success).length;
  }
  
  return { success: true, count: successCount };
}
