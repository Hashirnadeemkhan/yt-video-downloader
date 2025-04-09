interface VideoInfo {
    title: string
    thumbnail: string
    duration: string
    author: string
  }
  
  export async function getVideoInfo(url: string): Promise<VideoInfo> {
    try {
      const response = await fetch("/api/video-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to fetch video info")
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error fetching video info:", error)
      throw error
    }
  }
  
  export async function downloadVideo(url: string): Promise<boolean> {
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to download video")
      }
  
      const data = await response.json()
  
      if (data.message) {
        alert(data.message)
        return false
      }
  
      return true
    } catch (error) {
      console.error("Error downloading video:", error)
      throw error
    }
  }