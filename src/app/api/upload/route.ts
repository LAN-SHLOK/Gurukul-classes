import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Parse from CLOUDINARY_URL if individual vars not set
// Format: cloudinary://api_key:api_secret@cloud_name
function configureCloudinary() {
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  } else if (process.env.CLOUDINARY_URL) {
    // Let Cloudinary SDK auto-parse CLOUDINARY_URL
    cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
  } else {
    throw new Error("Cloudinary not configured. Set CLOUDINARY_URL or CLOUDINARY_API_KEY/SECRET.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP, GIF allowed." }, { status: 400 });
    }

    // Validate file size — 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // Convert to base64 data URI for Cloudinary upload
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    configureCloudinary();
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "gurukul-classes",
      resource_type: "image",
    });

    return NextResponse.json({ success: true, secure_url: result.secure_url, url: result.secure_url });
  } catch (error: any) {
    console.error("[Upload] Cloudinary error:", JSON.stringify(error?.message || error));
    return NextResponse.json({ error: `Upload failed: ${error?.message || "Unknown error"}` }, { status: 500 });
  }
}
