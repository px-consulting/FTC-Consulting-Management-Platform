import { prisma } from "@/lib/prisma";

export const FIRST_LEVEL_ACTIVITIES = [
  "High Level Organization Structure & Functional Org Chart",
  "HR deployment matrix & gap analysis",
  "Develop a detailed Master List of Employees",
  "Vision, Mission and Policies",
  "Identify a leadership team representing each function or the best team members to lead this change management program",
  "Master List of all Suppliers/Vendors supplying material or anything for the last 3-5 years(Active/repeated/Approved)",
  "Master List of Customers of served in last 5 years with complete contact details - Active / Nonactive / Repeated",
  "Master Daily Attendance System with one month MIS",
  "Company Profile (1 Page) & 10-15 Slide Presentation. Talk about your major achievements so far.",
  "Job Description of each employee (Role, Responsibility, Authority & Accountability)",
  "Remove all unnecessary documents/files/material from each office/cabin/shop floor and organise everything with an approach of identification of each and everything after putting everything at its designated places",
  "Design and develop company wide communication material (posters, standys, dashboards etc.)",
  "Master of SKILL MATRIX covering everyone in company",
  "SIPOC for each Function reflected in organization chart and as per high level process chacklist",
  "Process Flow Chart for each process under each Function",
];

export async function ensureFirstLevelChecklist(user) {
  const count = await prisma.checklistItem.count({
    where: { userId: user.id, level: 1 },
  });
  if (count === 0) {
    const data = FIRST_LEVEL_ACTIVITIES.map((activity) => ({
      userId: user.id,
      level: 1,
      activity,
      deadline: user.endDate,
    }));
    await prisma.checklistItem.createMany({ data });
  }
}

export async function getChecklist(userId) {
  return prisma.checklistItem.findMany({
    where: { userId },
    orderBy: [{ level: "asc" }, { id: "asc" }],
  });
}

export async function updateChecklistItem(id, formData) {
  const status = formData.get("status");
  const deadline = new Date(formData.get("deadline"));
  const remarks = formData.get("remarks");
  await prisma.checklistItem.update({
    where: { id },
    data: {
      status,
      deadline,
      remarks,
      updatedBy: "admin",
      updatedAt: new Date(),
    },
  });
}
