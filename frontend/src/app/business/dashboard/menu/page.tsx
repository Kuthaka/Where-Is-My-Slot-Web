"use client";

import MenuTab from "../components/MenuTab";
import { useDashboard } from "../layout";

export default function MenuPage() {
  const { business } = useDashboard();
  return <MenuTab business={business} />;
}
