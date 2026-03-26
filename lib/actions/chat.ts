// @ts-nocheck
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const DEFAULT_SYSTEM_PROMPT = `You are the AI Assistant for the Rooted Rising Initiative.
Rooted Rising is a dynamic media advocacy initiative that harnesses the power of storytelling, art, and grassroots activism to ignite climate action and gender equality.
Our motto is: "Rooted in Truth, Rising for Justice."

Key Focus Areas:
1. Gender Justice: Amplifying voices of women and marginalized genders.
2. Environment Justice: Advocating for communities in oil-sacrificed zones and demanding accountability from polluters.
3. Society: Empowering communities to challenge systemic injustices.

Methodology:
- Storytelling: Capturing human resilience.
- Content Creation: Producing high-impact digital media.
- Artistic Impact: Using visual and performance arts.

Contact Information:
- Email: info@rootedrising.org.ng
- Phone/WhatsApp: +234 (0) 706 821 2022

You help users understand our mission, methodology, and how to get involved. Be professional, inspiring, and helpful.

IMPORTANT INSTRUCTIONS: 
1. DO NOT use markdown formatting (no bolding, italics, or lists with asterisks). Respond ONLY in plain, conversational text.
2. If the user asks how to find things on the website, use these paths:
- Home: /
- About: /about
- Blog / Impact Stories: /blog
- Gallery / Visual Impact: /gallery
- Campaigns / Voice of the Frontline: /campaigns
- Opportunities / Volunteer: /opportunities
- Contact: /contact
- Dashboard/Admin: /admin`;

async function getPrompt(key: string, fallback: string) {
  try {
    const setting = await (prisma as any).aISettings.findUnique({
      where: { key }
    });
    return setting?.prompt || fallback;
  } catch (error) {
    return fallback;
  }
}

export async function generateChatResponse(history: { role: "user" | "model", parts: { text: string }[] }[], message: string) {
  try {
    const systemPrompt = await getPrompt("chat", DEFAULT_SYSTEM_PROMPT);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return { success: true, text: response.text() };
  } catch (error) {
    console.error("AI Chat error:", error);
    return { error: "Failed to connect to the AI service." };
  }
}

export async function refineContent(content: string, options?: { title?: string; excerpt?: string; type?: "blog" | "highlight" | "bio" | "chat" }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const { title, excerpt, type = "blog" } = options || {};
    
    let basePrompt = "";
    const defaultPrompts = {
      bio: content 
        ? `Refine this professional bio for a team member of the Rooted Rising Initiative.
           Team Member: {title} ({excerpt})
           Current Bio: {content}
           Task: Make it more engaging, professional, and impactful. 
           CRITICAL: Return ONLY plain text. NO markdown, NO hashtags.`
        : `Write a professional, 2-3 sentence bio for a team member of the Rooted Rising Initiative.
           Name: {title}
           Role: {excerpt}
           Context: Rooted Rising focuses on climate action and gender equality through storytelling, art, and grassroots activism.
           Tone: Professional, inspiring, and impactful.
           CRITICAL: Return ONLY plain text. NO markdown (no bold, no italics), NO hashtags.`,
      blog: `Refine this blog post content for the Rooted Rising Initiative. 
             Make it professional, engaging, and impactful. The initiative focuses on climate action and gender equality through storytelling, art, and grassroots activism.
             Return the refined content in HTML format suitable for a blog post.
             Title: {title}
             Excerpt: {excerpt}
             Current Content: {content}`,
      highlight: `Refine this campaign highlight content for the Rooted Rising Initiative. 
                 Make it professional, engaging, and impactful. The initiative focuses on climate action and gender equality through storytelling, art, and grassroots activism.
                 Return the refined content in HTML format suitable for a blog post.
                 Title: {title}
                 Excerpt: {excerpt}
                 Current Content: {content}`
    };

    basePrompt = await getPrompt(type, defaultPrompts[type] || defaultPrompts.blog);

    // Dynamic variable replacement
    const finalPrompt = basePrompt
      .replace(/{title}/g, title || "")
      .replace(/{excerpt}/g, excerpt || "")
      .replace(/{content}/g, content || "");

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Basic cleanup if Gemini wraps in markdown code blocks
    let cleanText = text.replace(/```[a-z]*\n?|```/gi, "").trim();
    
    if (type === "bio") {
      cleanText = cleanText.replace(/[*_#`~]/g, "").trim();
    }
    
    return { success: true, text: cleanText };
  } catch (error) {
    console.error("AI Refinement error:", error);
    return { error: "Failed to connect to the AI service." };
  }
}
