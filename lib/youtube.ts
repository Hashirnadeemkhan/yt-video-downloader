export async function getVideoInfo(url: string) {
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
  
  export async function downloadVideoA(url: string, ) {
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
  
      // If we have a message, it means we're in demo mode
      if (data.message) {
        alert(data.message)
        return false
      }
  
      // In a real application with a proper server environment:
      // Create a blob from the response
      // const blob = await response.blob()
      // Create a download link and trigger it
      // const downloadUrl = window.URL.createObjectURL(blob)
      // const a = document.createElement("a")
      // a.href = downloadUrl
      // a.download = `${title.replace(/[^\w\s]/gi, "")}.mp4`
      // document.body.appendChild(a)
      // a.click()
      // Clean up
      // window.URL.revokeObjectURL(downloadUrl)
      // document.body.removeChild(a)
  
      return true
    } catch (error) {
      console.error("Error downloading video:", error)
      throw error
    }
  }
  