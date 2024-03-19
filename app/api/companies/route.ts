import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/modules/db";

export async function GET(request: NextRequest) {

  try {
    const {rows: companies} = await query(
      `SELECT * FROM companies`,
    );

    return NextResponse.json(companies, { status: 200 })
    
  } catch (error: any) {
    const errorMessage = "An error occurred while processing your request.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
