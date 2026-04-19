import { Worker, Job } from "bullmq";
import { redisConnection } from "./client";
import { generateAdminNote } from "../services/admin-ai";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "../logger";
import { Note } from "../db/models/Note";
import { connectDB } from "../db/mongodb";
import { sendInquiryNotification, sendInquiryConfirmation } from "../services/email";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Note Generation Worker
export const noteWorker = new Worker(
  "note-generation",
  async (job: Job) => {
    const { prompt, title, subject, standard } = job.data;
    logger.info(`[QUEUE] Processing Note Job: ${job.id} - ${title}`);

    try {
      await connectDB();
      const result = await generateAdminNote(prompt);
      const content = result.markdown;
      const imagePrompts = result.image_prompts || [];

      // Generate PDF logic (copy-paste from route.ts for consistency in worker)
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 30;

      // Branding & Content loop...
      doc.setFillColor(45, 49, 250);
      doc.rect(0, 0, pageWidth, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("GURUKUL CLASSES — ACADEMIC EXCELLENCE", pageWidth / 2, 13, { align: "center" });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.text(title, margin, 40);
      y = 55;

      const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += 7;
      });

      // Images...
      for (const imgPrompt of imagePrompts) {
         try {
           const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=800&height=600&nologo=true`;
           const imgRes = await fetch(imgUrl);
           const imgBuf = await imgRes.arrayBuffer();
           const base64 = Buffer.from(imgBuf).toString('base64');
           if (y > 200) { doc.addPage(); y = 20; }
           doc.addImage(`data:image/jpeg;base64,${base64}`, "JPEG", margin, y, pageWidth - margin * 2, 80);
           y += 90;
         } catch (e) {
             logger.error(`[QUEUE] Image fail: ${imgPrompt}`, e);
         }
      }

      const pdfBuffer = doc.output("arraybuffer");

      // Upload
      const uploadResult: any = await new Promise((resolve, reject) => {
        const s = cloudinary.uploader.upload_stream({
          folder: "gurukul/notes/automated",
          resource_type: "raw",
          format: "pdf",
        }, (err, res) => err ? reject(err) : resolve(res));
        s.end(Buffer.from(pdfBuffer));
      });

      // Save to DB
      await Note.create({
        title, subject, standard,
        file_url: uploadResult.secure_url,
      });

      logger.info(`[QUEUE] Job Complete: ${job.id}`);
    } catch (err) {
      logger.error(`[QUEUE] Job ${job.id} failed:`, err);
      throw err; // Trigger BullMQ retry
    }
  },
  { connection: redisConnection }
);

noteWorker.on("failed", (job, err) => {
  logger.error(`[QUEUE] Note worker failed for job ${job?.id}:`, err);
});

// 2. Email Notification Worker
export const emailWorker = new Worker(
  "email-notifications",
  async (job: Job) => {
    const { email, first_name, last_name, class_name, message } = job.data;
    logger.info(`[QUEUE] Sending Inquiry Emails: ${job.id} for ${email}`);

    try {
      await Promise.all([
        sendInquiryNotification({
          first_name, last_name, email, class_name, message,
          created_at: new Date(),
        }),
        sendInquiryConfirmation({
          first_name, email,
        }),
      ]);
      logger.info(`[QUEUE] Emails Sent: ${job.id}`);
    } catch (err) {
      logger.error(`[QUEUE] Email job ${job.id} failed:`, err);
      throw err;
    }
  },
  { connection: redisConnection }
);

emailWorker.on("failed", (job, err) => {
  logger.error(`[QUEUE] Email worker failed for job ${job?.id}:`, err);
});
