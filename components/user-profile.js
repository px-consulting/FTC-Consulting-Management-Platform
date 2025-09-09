import React from "react";

export default function UserProfile({ user }) {
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
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4 border rounded p-4">
          <h2 className="text-lg font-medium">User Info</h2>
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
        </section>
        <section className="space-y-4 border rounded p-4">
          <h2 className="text-lg font-medium">Business Info</h2>
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
        </section>
      </div>
    </div>
  );
}
