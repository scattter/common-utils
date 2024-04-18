import {NextRequest, NextResponse} from "next/server";
import path from "path";
import fs from 'node:fs'
import {DEFAULT_ABSOLUTE_PATH} from "@/app/const";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, {
      status: 200
    })
  }
  try {
    const data = await request.formData()
    const file = data.get('file') as File
    const chunkName = data.get('chunkName') as File
    const fileName = data.get('fileName')
    const UPLOAD_DIR = path.resolve(DEFAULT_ABSOLUTE_PATH, `data/${fileName}-temp`)
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR)
    }
    const buffer = await file.arrayBuffer()
    fs.writeFileSync(`${UPLOAD_DIR}/${chunkName}`, new DataView(buffer))

    return NextResponse.json({
      info: {
        fileName: data.get('fileName'),
        chunkName: data.get('chunkName')
      }
    }, {
      status: 200
    })
  } catch(e) {
    return NextResponse.json({
      info: e
    }, {
      status: 500
    })
  }
}
