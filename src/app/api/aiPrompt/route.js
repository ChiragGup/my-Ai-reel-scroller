import Prompt from "@/module/ai";
import ConnectToDb from "@/helper/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helper/options";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ConnectToDb();

    const body = await request.json();
    const { userPrompt } = body;

    if (!userPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await Prompt.create({
      userPrompt,
      userId: session.user.id, // 🔒 ownership set here
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating prompt" },
      { status: 500 }
    );
  }
}
