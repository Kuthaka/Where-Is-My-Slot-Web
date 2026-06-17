"use client";

import { useDashboard } from "../layout";
import ProfileTab from "../components/ProfileTab";

export default function DashboardProfilePage() {
  const { business } = useDashboard();
  return <ProfileTab business={business} />;
}
