export interface RankedMentor {
  id: number;
  rank: number;
  previousRank: number | null;
  name: string;
  specialty: string;
  bio: string;
  avatarUrl: string | null;
  /** امتیاز فروش در دورهٔ جاری (مبنای رتبه) */
  points: number;
  /** میانگین امتیاز ستاره‌ای دانش‌آموزان */
  rating: number | null;
  reviewCount: number;
}

export interface MentorLeaderboard {
  periodLabel: string;
  comparisonLabel: string | null;
  updatedAt: string;
  rankingDescription: string;
  mentors: RankedMentor[];
}
