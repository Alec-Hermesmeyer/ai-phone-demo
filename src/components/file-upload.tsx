"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, Loader2 } from "lucide-react"
import { Progress } from "../components/ui/progress"
import { useToast } from "../components/ui/use-toast"

interface FileUploadProps {
  accept: Record<string, string[]>
  maxSize?: number
  onUpload: (file: File) => Promise<number>
}

export function FileUpload({ accept, maxSize = 5242880, onUpload }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        setProgress(0)

        for (const file of acceptedFiles) {
          const count = await onUpload(file)
          toast({
            title: "Upload complete",
            description: `Successfully processed ${count} items from ${file.name}`,
          })
          setProgress((prev) => prev + 100 / acceptedFiles.length)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process file. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [onUpload, toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled: isUploading,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
        ${isUploading ? "pointer-events-none" : "hover:border-primary hover:bg-primary/5"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <Progress value={progress} className="w-[60%]" />
          </>
        ) : (
          <>
            {isDragActive ? (
              <File className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">Drag & drop files here, or click to select</p>
          </>
        )}
      </div>
    </div>
  )
}

