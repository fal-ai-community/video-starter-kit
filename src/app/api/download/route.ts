import type { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new Response("Missing 'url' query parameter", {
      status: 400,
    });
  }
  try {
    const parsedUrl = new URL(url);
    return fetch(parsedUrl.toString());
  } catch (error) {
    return new Response("Invalid 'url' query parameter", {
      status: 400,
    });
  }
};
