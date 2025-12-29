import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helper/options";
import ConnectToDb from "@/helper/db";
import Video from "@/module/video";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await ConnectToDb();

    const videos = await Video.find({
      ownerId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("GET /api/video/me ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
