from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import speech_recognition as sr
import os
from pydub import AudioSegment
import tempfile
import platform
import shutil

# --- CONFIG ---

# FFmpeg path
if platform.system() == "Windows":
    # Windows path
    FFMPEG_PATH = r"C:\ffmpeg\bin\ffmpeg.exe"
else:
    FFMPEG_PATH = shutil.which("ffmpeg")

# pydub paths
AudioSegment.converter = FFMPEG_PATH
AudioSegment.ffprobe = shutil.which("ffprobe")

# Tesseract path
if platform.system() == "Windows":
    # Windows path
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# --- APP INIT ---

app = Flask(__name__)
# CORS enabled
CORS(app)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})


@app.route('/ocr', methods=['POST'])
def image_to_text():
    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        # Get language
        language = request.form.get('language', 'eng')

        image = Image.open(file.stream)

        # Run OCR
        text = pytesseract.image_to_string(image, lang=language)

        return jsonify({
            'success': True,
            'text': text.strip(),
            'filename': file.filename,
            'language_used': language
        })

    except pytesseract.TesseractError as e:
        # Tesseract error
        return jsonify({'error': f'OCR Error: Check language data for "{language}". Details: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server Error: {str(e)}'}), 500


@app.route('/audio-to-text', methods=['POST'])
def audio_to_text():
    temp_input_path = None
    temp_audio_path = None

    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        recognizer = sr.Recognizer()
        audio_data = file.read()
        file_ext = file.filename.split('.')[-1].lower()

        # Temp WAV file
        temp_audio = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        temp_audio_path = temp_audio.name
        temp_audio.close()

        # Conversion logic
        if file_ext in ['mp3', 'm4a', 'ogg', 'flac']:
            temp_input = tempfile.NamedTemporaryFile(
                delete=False, suffix=f'.{file_ext}')
            temp_input_path = temp_input.name
            temp_input.write(audio_data)
            temp_input.close()

            audio = AudioSegment.from_file(temp_input_path, format=file_ext)
            audio.export(temp_audio_path, format='wav')

            os.unlink(temp_input_path)
        else:
            # Direct write
            with open(temp_audio_path, 'wb') as f:
                f.write(audio_data)

        # Speech Recognition
        with sr.AudioFile(temp_audio_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)

        os.unlink(temp_audio_path)

        return jsonify({
            'success': True,
            'text': text,
            'filename': file.filename
        })

    except sr.UnknownValueError:
        return jsonify({'error': 'Could not understand audio.'}), 400

    except sr.RequestError as e:
        return jsonify({'error': f'Google Speech API error: {str(e)}'}), 500

    except Exception as e:
        # Cleanup
        if temp_input_path and os.path.exists(temp_input_path):
            os.unlink(temp_input_path)
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.unlink(temp_audio_path)

        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500


# --- RUN ---

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
