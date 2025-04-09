import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Basic URL validation
    if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    // Use a more reliable approach with YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`

    const response = await fetch(oembedUrl)

    if (!response.ok) {
      throw new Error(`YouTube oEmbed API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract video ID for thumbnail
    const videoId = url.includes("v=")
      ? url.split("v=")[1].split("&")[0]
      : url.includes("youtu.be/")
        ? url.split("youtu.be/")[1].split("?")[0]
        : null

    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null

    return NextResponse.json({
      title: data.title,
      thumbnail: thumbnailUrl,
      duration: "N/A", // oEmbed doesn't provide duration
      author: data.author_name,
    })
  } catch (error) {
    console.error("Error fetching video info:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch video information",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
