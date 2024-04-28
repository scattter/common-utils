import {crawlMain} from "@/middleware/firecrawl/crawlWeb";
import {NextRequest, NextResponse} from "next/server";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const crawlUrl = searchParams.get('crawlUrl')
  if (!crawlUrl) {
    return NextResponse.json({
      info: 'please input crawl url'
    }, {
      status: 500
    })
  }
  try {
    const crawlData = await crawlMain(crawlUrl)
    return NextResponse.json({
      info: crawlData ?? 'error'
    }, {
      status: 200
    })
  } catch (err) {
    return NextResponse.json({
      info: 'error'
    }, {
      status: 500
    })
  }
}