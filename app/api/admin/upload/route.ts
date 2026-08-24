import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const mimeType = file.type;
    const allowedMime = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (!allowedMime.includes(mimeType)) {
      return NextResponse.json(
        { error: "Only image files (JPG, PNG, WebP, GIF, SVG, AVIF) are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "blog");
    await fs.mkdir(uploadsDir, { recursive: true });

      const originalName = file.name || "image.png";
    const ext = path.extname(originalName) || ".png";
    const baseClean = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const uniqueName = `${baseClean}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/blog/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const msg = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
