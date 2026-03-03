import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        images: [data.image],
        category: data.category,
        stock: parseInt(data.stock),
      } as any,
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
