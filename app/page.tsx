"use client"

import type React from "react"
import { useState } from "react"
import { Download, Loader2, Youtube } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { downloadVideo, getVideoInfo } from "@/lib/youtube" // Importing from lib/youtube

interface VideoInfo {
  title: string
  thumbnail: string
  duration: string
  author: string
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError("")

    try {
      const info = await getVideoInfo(url)
      setVideoInfo(info)
    } catch (err) {
      setError("Failed to get video information. Please check the URL and try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!videoInfo) return

    setDownloading(true)
    setError("")

    try {
      const result = await downloadVideo(url)
      if (!result) {
        setError("This is a demo. Actual downloading requires a full server environment.")
      }
    } catch (err) {
      setError("Failed to download video. Please try again.")
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Youtube className="h-10 w-10 text-red-600" />
            <span>YouTube Downloader</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">Download your favorite YouTube videos with ease</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter YouTube URL</CardTitle>
            <CardDescription>Paste the URL of the YouTube video you want to download</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !url}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    "Get Info"
                  )}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>

            {videoInfo && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-1/3 relative rounded-lg overflow-hidden">
                    {videoInfo.thumbnail ? (
                      <Image
                        src={videoInfo.thumbnail}
                        alt={videoInfo.title}
                        width={500}
                        height={500}
                        className="w-full object-cover aspect-video"
                      />
                    ) : (
                      <Image
                        src="/placeholder.svg?height=180&width=320"
                        alt="Placeholder"
                        width={320}
                        height={180}
                        className="w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="sm:w-2/3">
                    <h3 className="text-lg font-medium text-gray-900">{videoInfo.title}</h3>
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <p>Channel: {videoInfo.author}</p>
                      <p>Duration: {videoInfo.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {videoInfo && (
            <CardFooter>
              <Button onClick={handleDownload} disabled={downloading} className="w-full">
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  )
}