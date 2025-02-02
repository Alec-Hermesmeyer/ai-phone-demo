import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"


export async function POST(req: Request) {
  const { message, companyProfile, context } = await req.json()

  const systemMessage = {
    role: "system",
    content: `You are an AI phone assistant for ${companyProfile.name}. 
    Industry: ${companyProfile.industry}
    Role: Handle customer inquiries professionally and naturally.
    Context: ${companyProfile.context}
    
    Guidelines:
    1. Use the provided knowledge base to answer questions
    2. Maintain the company's tone of voice
    3. Transfer to a human operator if confidence is low
    4. Follow company-specific protocols`,
  }

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages:  [{ role: "user", content: message }],
    temperature: 0.7,
  })

  return result.toDataStreamResponse()
}
