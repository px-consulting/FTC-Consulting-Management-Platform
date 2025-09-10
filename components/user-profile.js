import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateChecklistItem } from "@/lib/checklists";

export default function UserProfile({ user, checklist = [], isAdmin = false }) {
  const {
    name,
    email,
    phone,
    membership,
    startDate,
    endDate,
    businessName,
    companyAddress,
    annualRevenue,
    employeeCount,
    manufacturing,
    businessChallenges,
  } = user;

  const grouped = checklist.reduce((acc, item) => {
    acc[item.level] = acc[item.level] || [];
    acc[item.level].push(item);
    return acc;
  }, {});

  const statusLabels = {
    NOT_STARTED: "Not started",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  const levels = ["First", "Second", "Third"];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium">Name</dt>
              <dd>{name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Email</dt>
              <dd>{email}</dd>
            </div>
            {phone && (
              <div className="flex justify-between">
                <dt className="font-medium">Phone</dt>
                <dd>{phone}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="font-medium">Membership</dt>
              <dd>{membership}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Start Date</dt>
              <dd>{startDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">End Date</dt>
              <dd>{endDate}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Business Info</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            {businessName && (
              <div className="flex justify-between">
                <dt className="font-medium">Business Name</dt>
                <dd className="text-right">{businessName}</dd>
              </div>
            )}
            {companyAddress && (
              <div className="flex justify-between">
                <dt className="font-medium">Company Address</dt>
                <dd className="text-right">{companyAddress}</dd>
              </div>
            )}
            {annualRevenue !== null && (
              <div className="flex justify-between">
                <dt className="font-medium">Annual Revenue</dt>
                <dd>{annualRevenue}</dd>
              </div>
            )}
            {employeeCount !== null && (
              <div className="flex justify-between">
                <dt className="font-medium">Employee Headcount</dt>
                <dd>{employeeCount}</dd>
              </div>
            )}
            {manufacturing !== null && (
              <div className="flex justify-between">
                <dt className="font-medium">Manufacturing</dt>
                <dd>{manufacturing ? "Yes" : "No"}</dd>
              </div>
            )}
            {businessChallenges.length > 0 && (
              <div className="space-y-1">
                <dt className="font-medium">Business Challenges</dt>
                <dd>
                  <ul className="list-disc ml-4 space-y-1">
                    {businessChallenges.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Checklists</CardTitle>
        </CardHeader>
        <CardContent>
          {levels.map((label, idx) => {
            const level = idx + 1;
            const items = grouped[level] || [];
            return (
              <details key={level} className="mb-4">
                <summary className="cursor-pointer font-medium">
                  {label} Level Checklist
                </summary>
                <ul className="mt-2 space-y-2">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <li key={item.id} className="border rounded p-2 text-sm">
                        <p className="font-medium">{item.activity}</p>
                        {isAdmin ? (
                          <form
                            action={updateChecklistItem.bind(null, item.id)}
                            className="mt-2 space-y-2"
                          >
                            <div className="flex flex-col">
                              <label className="text-xs font-medium">
                                Deadline
                              </label>
                              <input
                                type="date"
                                name="deadline"
                                defaultValue={item.deadline
                                  .toISOString()
                                  .split("T")[0]}
                                className="border rounded px-2 py-1 text-xs"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-medium">
                                Status
                              </label>
                              <select
                                name="status"
                                defaultValue={item.status}
                                className="border rounded px-2 py-1 text-xs"
                              >
                                <option value="NOT_STARTED">Not started</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                              </select>
                            </div>
                            <div className="flex flex-col">
                              <label className="text-xs font-medium">
                                Remarks
                              </label>
                              <Input
                                name="remarks"
                                defaultValue={item.remarks}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="flex justify-end">
                              <SubmitButton pendingText="Saving...">
                                Save
                              </SubmitButton>
                            </div>
                          </form>
                        ) : (
                          <div className="mt-2 space-y-1">
                            <p>Deadline: {item.deadline.toISOString().split("T")[0]}</p>
                            <Badge variant={item.status.toLowerCase()}>
                              {statusLabels[item.status]}
                            </Badge>
                            <p>Remarks: {item.remarks}</p>
                          </div>
                        )}
                        {item.updatedBy && item.updatedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Updated by {item.updatedBy} at{" "}
                            {item.updatedAt
                              .toISOString()
                              .replace("T", " ")
                              .slice(0, 16)}
                          </p>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      No activities
                    </li>
                  )}
                </ul>
              </details>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
