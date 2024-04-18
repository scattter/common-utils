import {NextRequest, NextResponse} from "next/server";
import path from "path";
import fs from "node:fs";
import { DEFAULT_ABSOLUTE_PATH, DEFAULT_FILE_SPLIT_SIZE } from "@/app/const";

export async function POST(request: NextRequest) {
  const { fileName } = await request.json()
  const UPLOAD_DIR = path.resolve(DEFAULT_ABSOLUTE_PATH, `data/${fileName}-temp`)
  const chunks = fs.readdirSync(UPLOAD_DIR)
  chunks.sort((pre, next) => {
    const preSplit = pre.split('-')
    const nextSplit = next.split('-')
    return Number(preSplit.at(-1)) - Number(nextSplit.at(-1))
  })
  const writePromise = chunks.map((chunk, index) => {
    const filePath = `${UPLOAD_DIR}/${chunk}`
    return new Promise((resolve) => {
      const writeStream = fs.createWriteStream(path.resolve(DEFAULT_ABSOLUTE_PATH, `data/${fileName}`), {
        start: index * DEFAULT_FILE_SPLIT_SIZE,
      })
      const readStream = fs.createReadStream(filePath)
      readStream.on('end', () => {
        fs.unlinkSync(filePath) // 移除切片
        resolve('success')
      })
      readStream.pipe(writeStream)
    })
  })
  await Promise.all(writePromise)
  fs.rmdirSync(UPLOAD_DIR)
  return NextResponse.json({}, {
    status: 200
  })
}