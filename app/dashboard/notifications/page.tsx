import type { Metadata } from "next";

import NotificationList from "@/components/dash/notifications/notification-list";

export const metadata: Metadata = {
  title: "اعلان‌ها | آیوهوش",
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return <NotificationList />;
}
