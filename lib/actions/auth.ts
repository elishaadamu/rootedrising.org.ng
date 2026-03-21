"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { recordActivity } from "./logs";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER" // Default role for new signups
      },
    });

    const token = await createToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    revalidatePath("/");
    return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Something went wrong" };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid credentials" };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { error: "Invalid credentials" };
    }

    const token = await createToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    revalidatePath("/");
    
    // Log activity
    recordActivity({
      action: "LOGIN",
      entity: "Auth",
      details: "User logged into the system"
    }).catch(console.error);

    return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong" };
  }
}

export async function logout() {
  const session = await getSession();
  if (session) {
    recordActivity({
      action: "LOGOUT",
      entity: "Auth",
      details: "User logged out"
    }).catch(console.error);
  }
  (await cookies()).set("session", "", { expires: new Date(0) });
  revalidatePath("/");
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}
export async function changePassword(data: { oldPassword: string; newPassword: string }) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const { oldPassword, newPassword } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.id as string },
    });

    if (!user) return { error: "User not found" };

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return { error: "Incorrect current password" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await recordActivity({
      action: "UPDATED",
      entity: "Security",
      details: "User changed their password"
    });

    return { success: true };
  } catch (error) {
    return { error: "Failed to update password" };
  }
}
