import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/modules/db";
import { z } from "zod";

const createProviderSchema = z.object({
  provider_id: z.string(),
  subscriber_id: z.string(),
});

export async function DELETE(request: NextRequest) {
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
    const deleteProvider: any = await query(
      `DELETE FROM content_providers WHERE provider_id = $1 AND subscriber_id = $2`,
      [body.provider_id, body.subscriber_id]
    );

    if (deleteProvider.rowCount === 0) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    return NextResponse.json({message: "Provider deleted successfully."}, { status: 201 });
    
  } catch (error: any) {
    const errorMessage = "An error occurred while processing your request.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
