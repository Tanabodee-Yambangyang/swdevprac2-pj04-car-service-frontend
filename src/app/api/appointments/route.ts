
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Please log in to book an appointment." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${process.env.API_URL}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create appointment." },
      { status: 500 }
    );
  }
}
