import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/modules/db";
import { z } from "zod";

const createProviderSchema = z.object({
  provider_id: z.string(),
  subscriber_id: z.string(),
});

export async function POST(request: NextRequest) {
  if (request.headers.get("Content-Type") !== "application/json") {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = createProviderSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  try {
    const createProvider: any = await query(
      `INSERT INTO content_providers (provider_id, subscriber_id) VALUES ($1, $2)`,
      [body.provider_id, body.subscriber_id]
    );

    if (createProvider.rowCount !== 1) {
      return NextResponse.json({ error: "Failed to add Upstream" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Provider added successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    // Environment-specific error handling
    const isDevelopment = process.env.NODE_ENV === "development";

    // Detailed error for development, generic for production
    const errorMessage = isDevelopment
      ? error.message
      : "An error occurred while processing your request.";
    const statusCode = isDevelopment && error instanceof Error ? 400 : 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
