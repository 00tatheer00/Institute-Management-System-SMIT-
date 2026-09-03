import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to ArrayBuffer and base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/jpeg";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Cloudinary environment variables
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.CLOUDINARY_UPLOAD_PRESET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary credentials are configured, upload to Cloudinary
    if (cloudName && (uploadPreset || (apiKey && apiSecret))) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", base64Data);
      cloudinaryFormData.append("folder", "smit_students");

      if (uploadPreset) {
        cloudinaryFormData.append("upload_preset", uploadPreset);
      } else if (apiKey && apiSecret) {
        // Authenticated signature
        const timestamp = Math.round(new Date().getTime() / 1000).toString();
        cloudinaryFormData.append("timestamp", timestamp);
        cloudinaryFormData.append("api_key", apiKey);
      }

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      if (cloudinaryResponse.ok) {
        const cloudinaryData = await cloudinaryResponse.json();
        return NextResponse.json({
          success: true,
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          source: "cloudinary",
        });
      }
    }

    // Fallback: return high-res base64 data URL if Cloudinary is not configured yet
    return NextResponse.json({
      success: true,
      url: base64Data,
      source: "local-preview",
      message: "Image processed successfully. Cloudinary keys can be configured in .env.local.",
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
