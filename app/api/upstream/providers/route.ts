import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/modules/db";
import { z } from "zod";

// Combined schema to validate both company_id and type together
const requestSchema = z.object({
  company_id: z.string(),
  type: z.enum(["provider", "subscriber"]),
});

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const queryParams = {
    company_id: url.searchParams.get("company_id"),
    type: url.searchParams.get("type"),
  };

  // Validate all query parameters at once
  const validationResult = requestSchema.safeParse(queryParams);
  if (!validationResult.success) {
    return NextResponse.json(validationResult.error.errors, { status: 400 });
  }

  const { company_id, type } = validationResult.data;
  const queryString =
    type === "provider"
      ? `SELECT cp.*, c1.name AS company_name
FROM content_providers cp
INNER JOIN companies c1 ON cp.provider_id = c1.id
WHERE cp.subscriber_id = $1`
      : `SELECT cp.*, c1.name AS company_name
FROM content_providers cp
INNER JOIN companies c1 ON cp.subscriber_id = c1.id
WHERE cp.provider_id = $1`;

  try {
    const { rows: providers } = await query(queryString, [company_id]);
    return NextResponse.json(providers, { status: 200 });
  } catch (error) {
    // More accurate error handling
    const isDevelopment = process.env.NODE_ENV === "development";
    const errorMessage =
      isDevelopment && error instanceof Error
        ? error.message
        : "An error occurred while processing your request.";
    const statusCode = error instanceof Error ? 500 : 500; // Use appropriate status code

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
