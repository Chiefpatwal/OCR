# OCR & Audio Transcription Tool

A full-stack application that converts images to text (OCR) and audio to text (speech-to-text transcription).

## Features

- **Image to Text (OCR)**: Upload images and extract text using Tesseract OCR
- **Audio to Text**: Upload audio files and get transcriptions using Google Speech Recognition
- **Modern UI**: Clean, responsive React interface with real-time feedback
- **Multiple Format Support**:
  - Images: PNG, JPG, JPEG
  - Audio: WAV, MP3, M4A, OGG, FLAC

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
2. **Python** (v3.8 or higher)
3. **Tesseract OCR**
4. **FFmpeg**

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

## Quick Start

### Terminal 1: Backend Setup

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

5. Run the backend server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Terminal 2: Frontend Setup

1. From the project root directory, install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. You'll see two sections:
   - **Image to Text (OCR)**: Upload an image to extract text
   - **Audio to Text**: Upload an audio file to get transcription

### Image OCR
- Click the upload area in the left section
- Select an image file (PNG, JPG, JPEG)
- Click "Extract Text" button
- View the extracted text below

### Audio Transcription
- Click the upload area in the right section
- Select an audio file (WAV, MP3, M4A, OGG, FLAC)
- Click "Transcribe Audio" button
- View the transcribed text below

## API Endpoints

### Backend (http://localhost:5000)

#### Health Check
```
GET /health
```

#### Image OCR
```
POST /ocr
Content-Type: multipart/form-data
Body: file (image file)
```

#### Audio to Text
```
POST /audio-to-text
Content-Type: multipart/form-data
Body: file (audio file)
```

## Project Structure

```
.
├── backend/
│   ├── app.py              # Flask backend server
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend setup guide
├── src/
│   ├── components/
│   │   ├── ImageOCR.tsx   # Image OCR component
│   │   └── AudioToText.tsx # Audio transcription component
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
└── README.md              # This file
```

## Troubleshooting

### Backend Issues

**"Tesseract not found" error:**
- Make sure Tesseract is installed and added to your system PATH
- On macOS with Homebrew: `brew install tesseract`

**"FFmpeg not found" error:**
- Make sure FFmpeg is installed and added to your system PATH
- On macOS with Homebrew: `brew install ffmpeg`

**"Could not understand audio" error:**
- Make sure the audio is clear and contains speech
- Try using a different audio file format
- Check your internet connection (Google Speech Recognition API requires internet)

### Frontend Issues

**"Failed to connect to server" error:**
- Make sure the backend is running on `http://localhost:5000`
- Check if port 5000 is not blocked by a firewall

**CORS errors:**
- The backend has CORS enabled, but ensure both servers are running
- Backend should be on port 5000, frontend on port 5173

## Technology Stack

### Backend
- **Flask**: Web framework
- **Tesseract OCR**: Image text extraction
- **SpeechRecognition**: Audio transcription
- **Pillow**: Image processing
- **pydub**: Audio format conversion

### Frontend
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool

## Notes

- Audio transcription uses Google's Speech Recognition API which requires an internet connection
- Large audio files may take longer to process
- Image quality affects OCR accuracy
- The application does not store any uploaded files permanently
