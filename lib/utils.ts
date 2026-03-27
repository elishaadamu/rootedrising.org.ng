import { clsx, type ClassValue } from 'clsx'; import { twMerge } from 'tailwind-merge'; export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function createWordExcerpt(content: string, wordCount: number = 20) {
  if (!content) return "";
  const plainText = content.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  const words = plainText.split(/\s+/);
  if (words.length <= wordCount) return plainText;
  return words.slice(0, wordCount).join(" ") + "...";
}
