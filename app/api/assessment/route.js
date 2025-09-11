import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req) {
  const userIdCookie = cookies().get("userId");
  if (!userIdCookie) {
    return new Response("Unauthorized", { status: 401 });
  }
  const id = Number(userIdCookie.value);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (user.assessmentCredits <= 0) {
    return new Response("No credits left", { status: 403 });
  }
  const { answers } = await req.json();

  const promptParts = [
    "You are a business consultant. Generate a detailed 360 business maturity report based on the following sections and answers. Use clear headings and paragraphs.",
    "Business Owner: " + user.name,
    "Business Name: " + (user.businessName || ""),
    "Company Address: " + (user.companyAddress || ""),
    "Annual Revenue: " + (user.annualRevenue ?? ""),
    "Employee Count: " + (user.employeeCount ?? ""),
    "Manufacturing: " + (user.manufacturing ? "Yes" : "No"),
    "Business Challenges: " + user.businessChallenges.join(", "),
    "Answers:",
  ];
  for (const section of Object.keys(answers)) {
    promptParts.push(section + ":");
    for (const q of Object.keys(answers[section])) {
      promptParts.push(`${q}: ${answers[section][q]}`);
    }
  }
  const prompt = promptParts.join("\n");

  let report = "";
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }
    const result = await model.generateContent(prompt);
    report = result?.response?.text()?.trim() || "Report generation failed.";
  } catch (e) {
    report = "Report generation failed.";
  }

  await prisma.user.update({
    where: { id },
    data: { assessmentCredits: { decrement: 1 } },
  });

  return Response.json({ report, credits: user.assessmentCredits - 1 });
}
