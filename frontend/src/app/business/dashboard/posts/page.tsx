"use client";

import { useDashboard } from "../layout";
import PostsTab from "../components/PostsTab";

export default function DashboardPostsPage() {
  const { business } = useDashboard();
  return <PostsTab business={business} />;
}
