import { initObservability } from "@/app/observability";
import { StreamingTextResponse } from "ai";
import { ChatMessage, MessageContent } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
import {createQueryEngine} from "./engine";
import { LlamaIndexStream } from "./llamaindex-stream";

initObservability();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const convertMessageContent = (
  textMessage: string,
  imageUrl: string | undefined,
): MessageContent => {
  if (!imageUrl) return textMessage;
  return [
    {
      type: "text",
      text: textMessage,
    },
    {
      type: "image_url",
      image_url: {
        url: imageUrl,
      },
    },
  ];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, data }: { messages: ChatMessage[]; data: any; } = body;
    const userMessage = messages.pop();
    if (!messages || !userMessage || userMessage.role !== "user") {
      return NextResponse.json(
        {
          error:
            "messages are required in the request body and the last message must be from the user",
        },
        { status: 400 },
      );
    }

    const engine = await createQueryEngine(data?.referLink)
    const res = await engine.query({
      query: userMessage.content,
      stream: true,
    })

    // Transform LlamaIndex stream to Vercel/AI format
    const { stream, data: streamData } = LlamaIndexStream(res, {
      parserOptions: {
        image_url: data?.imageUrl,
      },
    });

    // Return a StreamingTextResponse, which can be consumed by the Vercel/AI client
    return new StreamingTextResponse(stream, {}, streamData);
  } catch (error) {
    console.error("[LlamaIndex]", error);
    return NextResponse.json(
      {
        error: (error as Error).message,
      },
      {
        status: 500,
      },
    );
  }
}
