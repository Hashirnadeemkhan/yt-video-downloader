import os
import yt_dlp
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import logging
from starlette.background import BackgroundTask

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Directories
DOWNLOAD_DIR = '/tmp/downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# FastAPI app initialization
app = FastAPI()

# Pydantic model for request validation
class DownloadRequest(BaseModel):
    url: str

# Custom progress hook for yt-dlp
class ProgressTracker:
    def __init__(self):
        self.progress = 0

    def hook(self, d):
        if d['status'] == 'downloading':
            if 'total_bytes' in d and 'downloaded_bytes' in d:
                self.progress = (d['downloaded_bytes'] / d['total_bytes']) * 100
        elif d['status'] == 'finished':
            self.progress = 100

@app.get("/")
async def home():
    return {"message": "YouTube Downloader API is running."}

@app.post("/download")
async def download(request: DownloadRequest):
    if not request.url:
        raise HTTPException(status_code=400, detail="No URL provided")

    progress_tracker = ProgressTracker()
    
    ydl_opts = {
        'format': 'best',
        'outtmpl': os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s'),
        'progress_hooks': [progress_tracker.hook],
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=True)
            file_path = ydl.prepare_filename(info)
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Download Error: {str(e)}")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail="Downloaded file not found")

    async def cleanup():
        try:
            os.remove(file_path)
            logger.info(f"Deleted temporary file: {file_path}")
        except Exception as e:
            logger.error(f"Error deleting file: {e}")

    return FileResponse(
        path=file_path,
        filename=os.path.basename(file_path),
        media_type='application/octet-stream',
        background=BackgroundTask(cleanup)
    )
