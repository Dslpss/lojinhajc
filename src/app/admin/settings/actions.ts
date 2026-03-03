"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

const SettingsSchema = z.object({
  storeName: z.string().min(3).max(50),
  storeDescription: z.string().min(10).max(200),
  supportWhatsApp: z.string().regex(/^\d{10,15}$/, "Formato de WhatsApp inválido"),
});

export async function getSettings() {
  try {
    let settings = await prisma.settings.findFirst();
    
    // Inicializa configurações padrão se não existirem
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          storeName: "Premium Store",
          storeDescription: "A melhor experiência de compra",
          supportWhatsApp: "5511999999999",
          premiumTheme: "dark",
        } as any,
      }) as any;
    }
    return settings;
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return null;
  }
}

export async function updateSettings(formData: {
  storeName: string;
  storeDescription: string;
  supportWhatsApp: string;
}) {
  try {
    const settings = await prisma.settings.findFirst();
    if (settings) {
      await prisma.settings.update({
        where: { id: (settings as any).id },
        data: formData as any,
      });
    } else {
      await prisma.settings.create({
        data: formData as any,
      });
    }
    revalidatePath("/admin/settings", "page");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return { success: false, error: "Falha ao salvar configurações" };
  }
}

export async function changePassword(formData: {
  oldPassword:  string;
  newPassword:  string;
}) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return { success: false, error: "Não autorizado" };

    const admin = await prisma.admin.findUnique({
      where: { email: session.user.email } as any,
    }) as any;

    if (!admin) return { success: false, error: "Administrador não encontrado" };

    // Verifica senha antiga
    const isMatch = await bcrypt.compare(formData.oldPassword, admin.password);
    if (!isMatch) return { success: false, error: "Senha atual incorreta" };

    // Hashea nova senha
    const hashedPassword = await bcrypt.hash(formData.newPassword, 10);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao mudar senha:", error);
    return { success: false, error: "Falha interna ao mudar senha" };
  }
}


