# Backend Setup Instructions

## Prerequisites

1. **Python 3.8+** installed
2. **Tesseract OCR** installed on your system
3. **FFmpeg** installed (for audio conversion)

### Install Tesseract OCR

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**Windows:**
Download and install from: https://github.com/UB-Mannheim/tesseract/wiki

### Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from: https://ffmpeg.org/download.html

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
```

3. Activate the virtual environment:

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Run the Backend

```bash
python app.py
```

The backend will run on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/health`
- Returns server status

### Image OCR
- **POST** `/ocr`
- Upload image file
- Returns extracted text

### Audio to Text
- **POST** `/audio-to-text`
- Upload audio file (wav, mp3, m4a, ogg, flac)
- Returns transcribed text
