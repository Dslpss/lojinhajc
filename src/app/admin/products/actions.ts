"use server";

// Server Actions para Gerenciamento de Produtos

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { unlink } from "fs/promises";
import { join } from "path";

const ProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(3).max(5000),
  price: z.number().positive(),
  images: z.array(z.string()), // Permite URLs e caminhos locais (/uploads/...)
  category: z.string().min(2),
  technicalSpecs: z.string().max(5000).optional().nullable(),
  condition: z.string().default("Novo"),
  stock: z.number().int().nonnegative(),
  isFeatured: z.boolean().default(false),
  isPromo: z.boolean().default(false),
  promoPrice: z.number().positive().optional().nullable(),
});

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" }
      ] as any,
    });

    // Sanitizar URLs para evitar erros de Next.js Image
    return products.map((p: any) => ({
      ...p,
      images: p.images.map((url: string) => url.trim()).filter((url: string) => url)
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}



export async function createProduct(formData: any) {
  try {
    const session = await getServerSession();
    if (!session) return { success: false, error: "Não autorizado" };

    if (formData.images) {
      formData.images = formData.images.map((url: string) => url.trim()).filter((url: string) => url);
    }
    const validatedData = ProductSchema.parse(formData);

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        technicalSpecs: validatedData.technicalSpecs || "",
        condition: validatedData.condition || "Novo",
      } as any,
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, product };
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return { success: false, error: "Falha ao criar produto" };
  }
}

export async function updateProduct(id: string, formData: any) {
  try {
    const session = await getServerSession();
    if (!session) return { success: false, error: "Não autorizado" };

    if (formData.images) {
      formData.images = formData.images.map((url: string) => url.trim()).filter((url: string) => url);
    }
    const validatedData = ProductSchema.partial().parse(formData);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...validatedData,
        technicalSpecs: validatedData.technicalSpecs || "",
        condition: validatedData.condition || "Novo",
      } as any,
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true, product };
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return { success: false, error: "Falha ao atualizar produto" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await getServerSession();
    if (!session) return { success: false, error: "Não autorizado" };

    // 1. Buscar o produto antes de excluir para pegar as URLs das imagens
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true }
    });

    if (!product) return { success: false, error: "Produto não encontrado" };

    // 2. Excluir do banco de dados
    await prisma.product.delete({
      where: { id },
    });

    // 3. Excluir arquivos locais fisicamente (🤖 @backend-specialist cleanup)
    for (const imageUrl of product.images) {
      if (imageUrl.startsWith("/uploads/")) {
        try {
          const fileName = imageUrl.replace("/uploads/", "");
          const filePath = join(process.cwd(), "public", "uploads", fileName);
          await unlink(filePath);
          console.log(`Arquivo removido: ${filePath}`);
        } catch (err) {
          console.error(`Erro ao remover arquivo local ${imageUrl}:`, err);
        }
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return { success: false, error: "Falha ao excluir produto" };
  }
}
