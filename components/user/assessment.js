"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";

const sections = [
  {
    title: "Strategic Planning",
    questions: [
      "My business has a clear and documented vision, mission statements and goals for next 1–3 years.",
      "We regularly set and review Annual Operating Plan towards achieving short-term and long-term business goals.",
      "Our strategies align with market trends and customer needs and we keep aligning our business model accordingly.",
      "We have a structured business plan that is actively implemented and reviewed for its effective implementation.",
      "The top management and leadership team is aligned on the company’s strategic priorities and are always willing to adopt change and evolve.",
    ],
  },
  {
    title: "Operational Efficiency",
    questions: [
      "We have streamlined processes and workflows to reduce inefficiencies.",
      "Our business operates with well-documented standard operating procedures (SOPs) and we are certified to standards like ISO 9001, ISO 14001, ISO 45001 or any industry-specific standards.",
      "We use technology and tools to automate repetitive or manual tasks.",
      "Our team has the competence, skills and resources to perform their tasks effectively using task management system.",
      "We consistently deliver quality products/services without defects and keep our pricing strategies in check.",
    ],
  },
  {
    title: "Financial Management",
    questions: [
      "We have a robust financial plan that includes forecasting and budgeting.",
      "Cash flow is actively monitored and managed every month to achieve desired EBITA & PAT.",
      "We regularly evaluate and optimize operational costs.",
      "We have a Financial Budget & Plan (CMA) for 5 years and all our decisions are based on accurate data and insights.",
      "We leverage Government Schemes from Ministry of MSME and have taken benefits to save operational costs in the past.",
    ],
  },
  {
    title: "Marketing and Sales",
    questions: [
      "We have a well-defined target audience and customer segments.",
      "We have a very structured marketing strategy and plan and we measure the ROI of our marketing campaigns regularly.",
      "The sales team follows a documented and efficient sales process and we achieve >90% of our sales targets every month.",
      "Customer acquisition and retention strategies are in place and we have a robust CRM system in place.",
      "Our business has a predictable sales pipeline with consistent lead generation, follow-ups, and conversion strategies to sustain long-term growth.",
    ],
  },
  {
    title: "Leadership and Team Management",
    questions: [
      "We have a competent and committed core team (3–9 members) as second line of command directly reporting to founder.",
      "We have well-documented organisation structure, roles and responsibilities, authorities and accountabilities clearly defined.",
      "Our leadership team regularly communicates the vision and goals to employees and we encourage innovation and empower employees to share new ideas.",
      "We provide regular training and development opportunities for employees and our organization fosters a positive and inclusive work culture.",
    ],
  },
  {
    title: "Founder’s Legacy",
    questions: [
      "We have built a purpose-driven organization that creates long-term value for stakeholders beyond just profits.",
      "Our business has been recognized with industry awards and customer accolades, celebrating our team’s excellence.",
      "We actively contribute to society and the environment through impactful CSR initiatives aligned with sustainability goals.",
      "We have a clear succession plan to empower the next generation to lead and grow the business.",
      "We embrace continuous learning and seek expert guidance from coaches and mentors to accelerate our transformation.",
    ],
  },
];

const options = [
  "Strongly Agree",
  "Agree",
  "Neutral",
  "Disagree",
  "Strongly Disagree",
];

export default function Assessment({ user }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(user.assessmentCredits);

  const current = sections[step];

  function updateAnswer(question, value) {
    setAnswers((prev) => ({
      ...prev,
      [current.title]: {
        ...(prev[current.title] || {}),
        [question]: value,
      },
    }));
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
        setCredits(data.credits);
      } else {
        alert("Unable to generate report");
      }
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    const doc = new jsPDF();
    const imgData = await fetch("/pxc-logo.png")
      .then((r) => r.blob())
      .then(
        (b) =>
          new Promise((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.readAsDataURL(b);
          })
      );
    doc.addImage(imgData, "PNG", 10, 10, 30, 15);
    doc.text("PX Consulting", 45, 20);
    doc.text(new Date().toLocaleString(), 10, 30);
    doc.text("About Business Owner:", 10, 40);
    doc.text(user.name, 10, 47);
    doc.text("About Business:", 10, 57);
    doc.text(`${user.businessName || ""} - ${user.companyAddress || ""}`, 10, 64);
    doc.text(report, 10, 74, { maxWidth: 180 });
    doc.save("business-maturity-report.pdf");
  }

  if (report) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">360 Business Maturity Assessment</h1>
        <p className="text-sm">{credits}/5 Report Credits remaining</p>
        <Card className="p-4 whitespace-pre-wrap">{report}</Card>
        <Button onClick={downloadPdf}>Download PDF</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">360 Business Maturity Assessment</h1>
      <p className="text-sm">{credits}/5 Report Credits remaining</p>
      <h2 className="text-xl font-semibold">{current.title}</h2>
      <div className="space-y-4">
        {current.questions.map((q) => (
          <Card key={q} className="p-4 space-y-2">
            <p>{q}</p>
            <div className="flex flex-col gap-1">
              {options.map((o) => (
                <label key={o} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q}
                    value={o}
                    checked={answers[current.title]?.[q] === o}
                    onChange={() => updateAnswer(q, o)}
                  />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Previous
        </Button>
        {step < sections.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
        ) : (
          <Button onClick={submit} disabled={loading || credits <= 0}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        )}
      </div>
    </div>
  );
}
