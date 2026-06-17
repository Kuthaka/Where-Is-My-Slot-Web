"use client";

import { useDashboard } from "./layout";
import OverviewTab from "./components/OverviewTab";

export default function DashboardOverviewPage() {
  const { business, user } = useDashboard();
  return <OverviewTab business={business} user={user} />;
}
