import type { RequestHandler } from "./$types"

import { systemPrompt } from "./prompt"
import { error } from "@sveltejs/kit"
import { streamText } from "@xsai/stream-text"
import { env } from "$env/dynamic/private"

const { OPENAI_API_KEY: apiKey, OPENAI_BASE_URL: baseURL = "https://api.openai.com/v1" } = env as unknown as { OPENAI_API_KEY?: string, OPENAI_BASE_URL?: string }

async function extract(html: string) {
  const { textStream } = await streamText({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: html },
    ],
    temperature: 0,
    apiKey,
    baseURL,
  })
  return textStream
}

export const POST: RequestHandler = async ({ request }) => {
  const html = await request.text()
  if (!html)
    error(400, "Missing request body")

  return new Response(await extract(html), { headers: { "content-type": "text/markdown" } })
}

export const config = { runtime: "edge" }
