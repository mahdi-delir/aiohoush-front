export const PERMISSIONS = {
    GIFT_VIEW: "gift.view",
    GIFT_CREATE: "gift.create",
    GIFT_EDIT: "gift.edit",

    COURSE_VIEW:"course.view",
    COURSE_CREATE:"course.create",
    COURSE_EDIT:"course.edit",

    AI_VIEW: "ai.view",
    AI_CREATE: "ai.create",
    AI_EDIT: "ai.edit",

    PROJECT_VIEW:"project.view",
    PROJECT_CREATE:"project.create",
    PROJECT_EDIT:"project.edit",

    WALLET_VIEW: "wallet.view",

    GUIDE_VIEW: "guide.view",
    GUIDE_CREATE: "guide.create",
    GUIDE_EDIT: "guide.edit",

    MYMENTOR_VIEW: "mymentor.view",
    MYMENTOR_CREATE: "mymentor.create",
    MYMENTOR_EDIT: "mymentor.edit",

    BESTMENTOR_VIEW:"bestmentor.view",


} as const

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];