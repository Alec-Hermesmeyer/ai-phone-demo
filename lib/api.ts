import { createOpenAI } from "@ai-sdk/openai"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set")
}

// Initialize OpenAI client
const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface Document {
  id: string
  content: string
  metadata: Record<string, any>
  score?: number
}

export interface SearchResponse {
  results: Document[]
  total: number
}

export interface DocumentCreate {
  content: string
  metadata?: Record<string, any>
}

export async function searchDocuments(query: string, limit = 5): Promise<SearchResponse> {
  const response = await fetch(`${API_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, limit }),
  })

  if (!response.ok) {
    throw new Error("Failed to search documents")
  }

  return response.json()
}

export async function addDocument(content: string, metadata: Record<string, any> = {}): Promise<Document> {
  const response = await fetch(`${API_URL}/api/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, metadata }),
  })

  if (!response.ok) {
    throw new Error("Failed to add document")
  }

  return response.json()
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/documents/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete document")
  }
}

export { openaiClient }

