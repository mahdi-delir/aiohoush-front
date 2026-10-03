import { NextRequest } from "next/server";

import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
) {
  const courseId =
    request.nextUrl.searchParams.get("course");

  if (!courseId) {
    return Response.json(
      {
        success: false,
        message: "شناسه دوره الزامی است.",
        called_by: "webapp",
      },
      {
        status: 400,
      },
    );
  }

  const response = await fetchDjango(
    `/course/homework/mine/?course=${encodeURIComponent(courseId)}`,
    {
      method: "GET",
    },
  );

  return forwardDjangoResponse(response);
}