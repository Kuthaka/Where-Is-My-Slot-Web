"use client";

import { useDashboard } from "../layout";
import OffersTab from "../components/OffersTab";

export default function DashboardOffersPage() {
  const { business } = useDashboard();
  return <OffersTab business={business} />;
}
