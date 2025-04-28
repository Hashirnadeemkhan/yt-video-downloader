import requests

url = 'http://localhost:5000/download'
data = {
    "url": "https://www.youtube.com/watch?v=CQXGMwLwGSE"  # Apna YouTube link daalo
}

response = requests.post(url, json=data)

# Save the downloaded file
if response.status_code == 200:
    with open("downloaded_video.mp4", "wb") as f:
        f.write(response.content)
    print("Video downloaded successfully!")
else:
    print(f"Error: {response.text}")
