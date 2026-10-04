import { ImageResponse } from "next/og";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: requestedSize } = await params;

  if (!["180", "192", "512"].includes(requestedSize)) {
    return new Response("Not found", { status: 404 });
  }

  const size = Number(requestedSize);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#071c27",
          color: "#70efb0",
          fontSize: size * 0.42,
          fontWeight: 700,
        }}
      >
        AI
      </div>
    ),
    {
      width: size,
      height: size,
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}