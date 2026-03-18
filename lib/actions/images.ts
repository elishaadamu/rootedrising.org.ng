"use server";

import fs from "fs";
import path from "path";

export async function getLocalImages() {
  try {
    const imagesDir = path.join(process.cwd(), "public/images");
    const files = fs.readdirSync(imagesDir);
    
    // Filter for common image extensions and exclude directories
    const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"];
    const images = files
      .filter(file => {
        const fullPath = path.join(imagesDir, file);
        return fs.statSync(fullPath).isFile() && imageExtensions.includes(path.extname(file).toLowerCase());
      })
      .map(file => `/images/${file}`);
      
    return { success: true, images };
  } catch (error: any) {
    console.error("Error reading images directory:", error);
    return { success: false, images: [] };
  }
}
