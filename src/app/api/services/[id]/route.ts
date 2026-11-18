
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      session: null,
      error: Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      session: null,
      error: Response.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return { session, error: null };
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { session, error } = await getAdminSession();

    if (error || !session) return error;

    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(
      `${process.env.API_URL}/services/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const result = await response.json();

    return Response.json(result, { status: response.status });
  } catch (error) {
    console.error("Update service error:", error);

    return Response.json(
      { success: false, message: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { session, error } = await getAdminSession();

    if (error || !session) return error;

    const { id } = await context.params;

    const response = await fetch(
      `${process.env.API_URL}/services/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    return Response.json(result, { status: response.status });
  } catch (error) {
    console.error("Delete service error:", error);

    return Response.json(
      { success: false, message: "Failed to delete service" },
      { status: 500 }
    );
  }
}
