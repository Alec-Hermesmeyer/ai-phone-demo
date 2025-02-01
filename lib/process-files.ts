import * as pdfjsLib from "pdfjs-dist"
import { parse } from "papaparse"
import { addDocument } from "./api"

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function processPDF(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const numPages = pdf.numPages
  let processedPages = 0

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(" ")

    await addDocument(pageText, {
      type: "document",
      source: file.name,
      page: i,
    })
    processedPages++
  }

  return processedPages
}

export async function processCSV(file: File): Promise<number> {
  const text = await file.text()
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      complete: async (results) => {
        try {
          let count = 0
          for (const row of results.data) {
            if (row.question && row.answer) {
              await addDocument(row.answer, {
                type: "faq",
                question: row.question,
                categories: row.categories?.split(",").map((c: string) => c.trim()) || [],
              })
              count++
            }
          }
          resolve(count)
        } catch (error) {
          reject(error)
        }
      },
      error: (error) => reject(error),
    })
  })
}

export function exportFAQs(faqs: any[]) {
  const csv = parse.unparse(faqs)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "faqs.csv"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

