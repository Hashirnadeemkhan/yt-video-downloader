import requests
import urllib.parse

url = 'http://localhost:8000/download'  # Updated port to 8000
data = {
    "url": "https://www.youtube.com/watch?v=CQXGMwLwGSE"  # Your YouTube link
}

response = requests.post(url, json=data)

# Save the downloaded file
if response.status_code == 200:
    # Use the filename from the response headers if available
    content_disposition = response.headers.get('content-disposition', '')
    
    # Extract filename from content-disposition and handle URL encoding
    filename = 'downloaded_video.mp4'  # Default filename
    if 'filename=' in content_disposition:
        filename = content_disposition.split('filename=')[1].strip('"')
        filename = urllib.parse.unquote(filename)  # Decode the filename

    with open(filename, "wb") as f:
        f.write(response.content)
    print(f"Video downloaded successfully as {filename}!")
else:
    print(f"Error: {response.text}")
