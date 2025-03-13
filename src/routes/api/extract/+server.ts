import type { RequestHandler } from "./$types"

import { systemPrompt } from "./prompt"
import { error } from "@sveltejs/kit"
import { iteratorToStream } from "$lib/utils/stream"
import { OpenAI } from "openai"

const client = new OpenAI()

async function* extract(html: string) {
  for await (const chunk of await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: html },
    ],
    stream: true,
    temperature: 0,
  })) {
    const delta = chunk.choices[0].delta.content
    if (delta)
      yield delta
  }
}

export const POST: RequestHandler = async ({ request }) => {
  const html = await request.text()
  if (!html)
    error(400, "Missing request body")

  return new Response(iteratorToStream(extract(html)), { headers: { "content-type": "text/markdown" } })
}

export const config = { runtime: "edge" }
