import {NextResponse} from "next/server";
import client from "@/middleware/redis/init";

export async function GET() {
  // await client.set("name", "Flavio")

  const name = await client.get('name')

  return NextResponse.json(
    {
      name,
    },
    {
      status: 200,
    },
  );
}