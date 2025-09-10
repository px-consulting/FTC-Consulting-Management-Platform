"use client";

import { useState } from "react";
import { submitOnboarding } from "@/app/user/onboarding/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function OnboardingForm({ user }) {
  const [step, setStep] = useState(1);
  const [challenges, setChallenges] = useState([""]);
  const [imageError, setImageError] = useState("");
  const [useExistingPassword, setUseExistingPassword] = useState(true);

  const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file && file.size > MAX_IMAGE_SIZE) {
      setImageError("Image size must be less than 4MB.");
      e.target.value = "";
    } else {
      setImageError("");
    }
  }

  function addChallenge() {
    if (challenges.length < 3) {
      setChallenges([...challenges, ""]);
    }
  }

  function updateChallenge(index, value) {
    const updated = [...challenges];
    updated[index] = value;
    setChallenges(updated);
  }

  return (
    <form action={submitOnboarding} className="space-y-6" encType="multipart/form-data">
      <Card hidden={step !== 1}>
        <CardHeader>
          <CardTitle>Step 1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue={user.name} disabled />
          </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input defaultValue={user.phone || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Membership Taken</Label>
              <Input defaultValue={user.membership} disabled />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input defaultValue={user.startDate} disabled />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input defaultValue={user.endDate} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                defaultValue={user.businessName || ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imageError && (
                <p className="text-sm text-red-600">{imageError}</p>
              )}
            </div>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card hidden={step !== 2}>
        <CardHeader>
          <CardTitle>Step 2</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input
              id="companyAddress"
              name="companyAddress"
              placeholder="Enter company address"
            />
          </div>
            <div className="space-y-2">
              <Label htmlFor="annualRevenue">Annual Revenue</Label>
              <Input
                id="annualRevenue"
                name="annualRevenue"
                type="number"
                placeholder="Enter annual revenue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeCount">Employee Headcount</Label>
              <Input
                id="employeeCount"
                name="employeeCount"
                type="number"
                placeholder="Enter total employees"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturing">
                Are you involved in manufacturing?
              </Label>
              <Select name="manufacturing">
                <SelectTrigger id="manufacturing">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Top Business Challenges</Label>
              {challenges.map((c, i) => (
                <Input
                  key={i}
                  name="challenges"
                  value={c}
                  onChange={(e) => updateChallenge(i, e.target.value)}
                  className={i < challenges.length - 1 ? "mb-2" : undefined}
                />
              ))}
              {challenges.length < 3 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addChallenge}
                >
                  +
                </Button>
              )}
            </div>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setStep(3)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card hidden={step !== 3}>
        <CardHeader>
          <CardTitle>Step 3</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={useExistingPassword}
                onChange={() => setUseExistingPassword(true)}
              />
              <span>Continue with current password</span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={!useExistingPassword}
                onChange={() => setUseExistingPassword(false)}
              />
              <span>Set new password</span>
            </label>
            {!useExistingPassword && (
              <Input
                id="password"
                name="password"
                type="text"
                placeholder="Enter new password"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={() => setStep(4)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
      {step === 4 && (
        <div className="flex justify-center pt-4">
          <SubmitButton className="px-8 py-6 text-lg" pendingText="Saving...">
            Get Started
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
