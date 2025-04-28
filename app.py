import os
import time
from flask import Flask, request, jsonify, Response, stream_with_context, send_file, after_this_request
import yt_dlp

app = Flask(__name__)

# Directories
DOWNLOAD_DIR = '/tmp/downloads'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

@app.route('/')
def home():
    return jsonify({"message": "YouTube Downloader API is running."}), 200

@app.route('/download', methods=['POST'])
def download():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    ydl_opts = {
        'format': 'best',
        'outtmpl': os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s'),
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            file_path = ydl.prepare_filename(info)
    except Exception as e:
        return jsonify({"error": f"Download Error: {str(e)}"}), 500

    if not os.path.exists(file_path):
        return jsonify({"error": "Downloaded file not found"}), 500

    @after_this_request
    def remove_file(response):
        try:
            os.remove(file_path)
            app.logger.info(f"Deleted temporary file: {file_path}")
        except Exception as e:
            app.logger.error(f"Error deleting file: {e}")
        return response

    return send_file(
        file_path,
        as_attachment=True,
        download_name=os.path.basename(file_path),
        mimetype='application/octet-stream'
    )

@app.route('/progress', methods=['GET'])
def progress():
    def generate():
        for i in range(0, 101, 10):
            yield f"data: {{\"percent\": {i}}}\n\n"
            time.sleep(0.1)
    return Response(stream_with_context(generate()), mimetype='text/event-stream')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
