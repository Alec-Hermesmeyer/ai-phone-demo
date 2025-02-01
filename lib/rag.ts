// This will interface with our separate RAG service
export interface RAGResponse {
    content: string
    confidence: number
    sources: Array<{
      title: string
      url?: string
      content: string
      similarity: number
    }>
  }
  
  export interface RAGQuery {
    query: string
    companyId: string
    maxResults?: number
    minConfidence?: number
  }
  
  export class RAGClient {
    private baseUrl: string
    private apiKey: string
  
    constructor() {
      this.baseUrl = process.env.RAG_SERVICE_URL || "http://localhost:8000"
      this.apiKey = process.env.RAG_SERVICE_API_KEY || ""
    }
  
    async query(params: RAGQuery): Promise<RAGResponse> {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(params),
      })
  
      if (!response.ok) {
        throw new Error("RAG query failed")
      }
  
      return response.json()
    }
  }
  
  // Singleton instance
  export const ragClient = new RAGClient()
  
  