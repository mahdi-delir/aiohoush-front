export interface AnnouncementItem {
  id: number;
  title: string;
  body: string;
  link: string | null;
  sender: string;
  createdAt: string;
  read: boolean;
}

export interface AnnouncementInbox {
  items: AnnouncementItem[];
  unreadCount: number;
  page: number;
  pageCount: number;
}
