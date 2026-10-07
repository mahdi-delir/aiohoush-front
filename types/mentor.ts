export type MentorRating = 1 | 2 | 3 | 4 | 5;

export interface MentorProfile {
    id: number;
    name: string;
    headline: string;
    bio: string;
    avatarUrl: string | null;
    specialties: string[];
    mobile: string;
    telegramId: string | null;
}

export interface MentorReviews {
    id: number;
    authorName: string;
    rating: MentorRating;
    text: string;
    createdAt: string;
}

export interface MyMentorData {
    mentor: MentorProfile | null;
    reviews: MentorReviews[];
    myReview: MentorReviews | null;
    mentorRequest: { createdAt: string } | null;
}
