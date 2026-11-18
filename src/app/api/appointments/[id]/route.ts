
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getAccessToken() {
  const session = await getServerSession(authOptions);
  return session?.user?.accessToken;
}

// PUT /api/appointments/:id
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_URL}/appointments/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update appointment." },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/:id
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Please log in first." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const response = await fetch(
      `${process.env.API_URL}/appointments/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Delete appointment error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to delete appointment." },
      { status: 500 }
    );
  }
}
