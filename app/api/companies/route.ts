import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/modules/db";

export async function GET(request: NextRequest) {

  try {
    const {rows: companies} = await query(
      `SELECT * FROM companies`,
    );

    return NextResponse.json(companies, { status: 200 })
    
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
