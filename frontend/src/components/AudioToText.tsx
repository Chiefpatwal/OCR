import { useState } from 'react';
import { Upload, Mic, Loader2, Download, Copy } from 'lucide-react';

export default function AudioToText() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscribedText('');
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an audio file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/audio-to-text`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setTranscribedText(data.text);
      } else {
        setError(data.error || 'Failed to transcribe audio. Check server logs.');
      }
    } catch (err) {
      setError('Failed to connect to server. Check backend URL configuration.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!transcribedText) return;
    
    try {
      await navigator.clipboard.writeText(transcribedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy text (Browser security restriction)');
    }
  };

  const downloadText = () => {
    // Client-side download
    if (!transcribedText) return;

    const blob = new Blob([transcribedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelliscan_transcription_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  

  return (
    // Card background
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-t-4 border-gray-400 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Mic className="text-lime-600 dark:text-lime-300" size={28} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Audio to Text Transcription</h2>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-all duration-300 hover:shadow-lg">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Upload className="mx-auto text-gray-400 dark:text-gray-500 mb-3 hover:text-lime-500 dark:hover:text-lime-400 transition-colors" size={56} />
            <p className="text-gray-900 dark:text-gray-300 font-medium">Click to upload an audio file</p>
            <p className="text-sm text-gray-700 dark:text-gray-500 mt-2">WAV, MP3, M4A, OGG, FLAC supported (via FFmpeg)</p>
          </label>
        </div>

        {/* Selected File Details */}
        {selectedFile && (
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 font-mono">
            <p className="text-sm text-gray-900 dark:text-gray-300">
              <span className="font-semibold">File:</span> {selectedFile.name}
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Transcribe Button */}
        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-lime-500 to-lime-600 text-white py-3 rounded-lg font-semibold hover:from-lime-600 hover:to-lime-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Transcribing...
              </>
            ) : (
              'Transcribe Audio'
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Transcribed Text Result */}
        {transcribedText && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-lg">Transcribed Text:</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className={`${
                    copySuccess ? 'bg-lime-700' : 'bg-lime-500 hover:bg-lime-600'
                  } text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md`}
                  title="Copy to Clipboard"
                >
                  <Copy size={20} />
                </button>
                <button
                  onClick={downloadText}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
                  title="Download as Text File"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
            {copySuccess && (
              <p className="text-lime-600 dark:text-lime-400 text-sm font-medium">✓ Copied to clipboard!</p>
            )}
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-5 max-h-80 overflow-y-auto shadow-inner">
              <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-300 leading-relaxed font-sans text-sm">{transcribedText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}