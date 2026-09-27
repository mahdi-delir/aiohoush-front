import { ApiResponse } from "@/types/global";
import type { HomeworkSubmission } from "@/types/homework";

export const mockHomework: ApiResponse<HomeworkSubmission[]> = {
  success: true,
  message: "دریافت داده ها از سرور با موفقیت انجام شد.",
  called_by: "webapp",

  data: [
    {
      id: "demo-submission-3",
      courseId: 1,
      lesson: { id: 3, order: 3, title: "جلسه سوم دوره html" },
      submittedAt: "2026-09-26T17:30:00Z",
      reviewedAt: null,
      status: "unreviewed",
      files: [
        {
          id: "student-file-3",
          name: "exercise-03.zip",
          kind: "file",
          url: null,
        },
      ],
      feedback: null,
    },
    {
      id: "demo-submission-2",
      courseId: 1,
      lesson: { id: 2, order: 2, title: "جلسه دوم دوره html" },
      submittedAt: "2026-09-25T14:00:00Z",
      reviewedAt: null,
      status: "in_review",
      files: [
        {
          id: "student-file-2a",
          name: "exercise-02.zip",
          kind: "file",
          url: null,
        },
        { id: "student-file-2b", name: "توضیحات.pdf", kind: "file", url: null },
      ],
      feedback: null,
    },
    {
      id: "demo-submission-1",
      courseId: 1,
      lesson: { id: 1, order: 1, title: "جلسه اول دوره html" },
      submittedAt: "2026-09-23T10:00:00Z",
      reviewedAt: "2026-09-24T08:15:00Z",
      status: "reviewed",
      files: [
        {
          id: "student-file-1",
          name: "exercise-01.zip",
          kind: "file",
          url: null,
        },
      ],
      feedback: {
        teacherName: "مدرس نمونه",
        text: "ساختار کلی تمرین درست است. برای خواناتر شدن کد، نام‌گذاری‌ها را یکدست کن. توضیحات تکمیلی در پیوست‌ها قرار دارد.",
        attachments: [
          {
            id: "feedback-file",
            name: "اصلاحات تمرین.pdf",
            kind: "file",
            url: null,
          },
          {
            id: "feedback-video",
            name: "ویدئوی بررسی تمرین",
            kind: "video",
            delivery: "file",
            url: null,
          },
          {
            id: "feedback-audio",
            name: "توضیحات صوتی استاد",
            kind: "audio",
            url: null,
          },
        ],
      },
    },
  ],
};
