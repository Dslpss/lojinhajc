import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// 🤖 Applying knowledge of @backend-specialist and @security-auditor...

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if directory already exists
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Security: Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ success: false, error: "Apenas imagens são permitidas" }, { status: 400 });
      }

      // Security: Limit file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: "Arquivo muito grande (máx 5MB)" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Security: Generate unique filename to avoid collisions and path traversal
      const extension = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${extension}`;
      const path = join(uploadDir, fileName);

      await writeFile(path, buffer);
      uploadedUrls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ success: false, error: "Falha interna no upload" }, { status: 500 });
  }
}
