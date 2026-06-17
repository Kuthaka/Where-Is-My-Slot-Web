"use client";

import { useState } from "react";
import { useDashboard } from "../layout";
import SecurityTab from "../components/SecurityTab";

export default function DashboardSecurityPage() {
  const { user } = useDashboard();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  const handlePasswordSubmit = async (e: React.FormEvent, passwordState: any) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/auth/set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: passwordState.newPassword,
          ...(user?.isPasswordSet ? { oldPassword: passwordState.oldPassword } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message?.message || data.message || "Failed to update password");
      }
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      // Reloading context is tricky, you can dispatch to Redux or just trigger a refresh
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPasswordMessage({ type: "error", text: err.message });
      } else {
        setPasswordMessage({ type: "error", text: "An error occurred" });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <SecurityTab 
      user={user} 
      handlePasswordSubmit={handlePasswordSubmit} 
      passwordLoading={passwordLoading} 
      passwordMessage={passwordMessage} 
    />
  );
}
