export interface AnnouncementItem {
  id: number;
  title: string;
  body: string;
  /** مسیر داخلی اپ یا آدرس https */
  link: string | null;
  /** «آیوهوش»، «استاد …» یا «منتور …» */
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
