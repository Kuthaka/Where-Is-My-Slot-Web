"use client";

import { useDashboard } from "../layout";
import ParkingTab from "../components/ParkingTab";

export default function DashboardParkingPage() {
  const { business } = useDashboard();
  return <ParkingTab business={business} />;
}
