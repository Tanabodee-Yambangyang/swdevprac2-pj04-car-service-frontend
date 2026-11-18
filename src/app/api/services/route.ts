
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return Response.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${process.env.API_URL}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result = await response.json();

    return Response.json(result, { status: response.status });
  } catch (error) {
    console.error("Create service error:", error);

    return Response.json(
      { success: false, message: "Failed to create service" },
      { status: 500 }
    );
  }
}
