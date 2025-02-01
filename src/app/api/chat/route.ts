import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add system message to help AI understand its role
  const systemMessage = {
    role: "system",
    content: `You are an AI phone assistant for a boat tour company. 
    Answer questions about tours, schedules, and policies.
    If you're unsure about something, acknowledge that you'll need to transfer to a human operator.
    Be friendly and professional.`,
  }

  const result = streamText({
    model: openaiClient("gpt-4-turbo"),
    messages: [systemMessage, ...messages],
  })

  return result.toDataStreamResponse()
}

