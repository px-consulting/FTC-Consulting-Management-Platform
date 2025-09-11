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

export const SECOND_LEVEL_ACTIVITIES = [
  "Standard Operating Procedures (Functions)",
  "Guidelines (applicable under each SOP)",
  "Forms/Formats (applicable under each SOP)",
  "KPIs for each function (Business Objectives)",
  "Detailed Job Descriptions of all poistions",
  "KRAs for each position (generic)",
  "KRAs for each person working in the company/business eco-system (specific)",
  "RACI Chart (Function Vs Positions)",
  "Business Plan (1 Year)",
  "Sample Learning & Development/ Training Plan covering Modules as per Skill Matrix",
  "Data Sheets (in each function)- daily data feed",
  "Data Analysis & MIS Graphs & Trend Charts",
  "Management Information Systsem (MIS) for each process under each function",
  "Business Management Manual (TOC) and draft manual",
  "Busines Management Manual_Final Version 1.0",
];

export const THIRD_LEVEL_ACTIVITIES = [
  "Quality Manual (ISO 9001:2015 Requirements)",
  "Quality Assurance Plans for all processes and products",
  "Finalise, approve and release Business Operations Manuual",
  "Training on ISO 9001:2015 awareness across teams (4 levels)",
  "Training on Internal Auditing Skills (CFT)",
  "Internal Audit across departments and proceses and reports",
  "Management Review and MOM",
  "Filing Management / Online Google Sheets Update",
  "Validate KPIs and KRAs performance for FY 2025-26 ( 9-12 months)",
  "Market Research Report (TOM SOM SAM)",
  "Financial Model (CMA) for 5 years",
  "Sales Forecasting",
  "Brand Manual (Logo and Positioning)",
  "Factory Fitness Audit",
  "ISO 9001:2015 Certification",
];

export async function ensureChecklists(user) {
  const levels = [
    { level: 1, activities: FIRST_LEVEL_ACTIVITIES },
    { level: 2, activities: SECOND_LEVEL_ACTIVITIES },
    { level: 3, activities: THIRD_LEVEL_ACTIVITIES },
  ];

  for (const { level, activities } of levels) {
    const count = await prisma.checklistItem.count({
      where: { userId: user.id, level },
    });
    if (count === 0) {
      const data = activities.map((activity) => ({
        userId: user.id,
        level,
        activity,
        deadline: user.endDate,
      }));
      await prisma.checklistItem.createMany({ data });
    }
  }
}

export async function getChecklist(userId) {
  return prisma.checklistItem.findMany({
    where: { userId },
    orderBy: [{ level: "asc" }, { id: "asc" }],
  });
}

export async function updateChecklistItem(id, formData) {
  "use server";
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
