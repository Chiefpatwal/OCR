import { useState } from 'react';
import { Upload, FileImage, Loader2, Volume2, Copy, Download, Globe } from 'lucide-react';

export default function ImageOCR() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<string>('eng');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'hin', name: 'Hindi' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'ara', name: 'Arabic' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setExtractedText('');
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('language', language);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/ocr`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setExtractedText(data.text);
      } else {
        setError(data.error || 'Failed to extract text. Check server logs.');
      }
    } catch (err) {
      setError('Failed to connect to server. Check backend URL configuration and status.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = () => {
    // Text-to-Speech logic
    if (!extractedText) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(extractedText);
    utterance.lang = language === 'hin' ? 'hi-IN' : language === 'spa' ? 'es-ES' : 'en-US'; 
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const copyToClipboard = async () => {
    if (!extractedText) return;
    
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy text (Browser security restriction)');
    }
  };

  const downloadText = () => {
    // Client-side download
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelliscan_ocr_text_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  return (
    // Card background
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-t-4 border-gray-400 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <FileImage className="text-teal-600 dark:text-teal-300" size={28} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Image to Text (OCR)</h2>
      </div>

      <div className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
          <Globe className="text-gray-600 dark:text-gray-400" size={20} />
          <select
            value={language}
            onChange={(e) => {
                setLanguage(e.target.value);
                setExtractedText(''); 
            }}
            className="flex-1 border-none bg-transparent text-gray-900 dark:text-gray-300 font-medium focus:ring-0"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-gray-500 transition-all duration-300 hover:shadow-lg">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="mx-auto text-gray-400 dark:text-gray-500 mb-3 hover:text-teal-500 dark:hover:text-teal-400 transition-colors" size={56} />
            <p className="text-gray-900 dark:text-gray-300 font-medium">Click to upload or Drag & Drop</p>
            <p className="text-sm text-gray-700 dark:text-gray-500 mt-2">PNG, JPG, JPEG supported • Ensure clear text</p>
          </label>
        </div>

        {/* File Preview */}
        {preview && (
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-xl p-4 border border-gray-300 dark:border-gray-600">
            <div className='max-h-64 overflow-hidden rounded-lg shadow-md'>
                <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto object-contain"
                />
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-400 mt-3 text-center font-medium">{selectedFile?.name}</p>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              'Extract Text'
            )}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}

        {/* Extracted Text Result */}
        {extractedText && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-200 text-lg">Extracted Text:</h3>
              <div className="flex gap-2">
                <button
                  onClick={speakText}
                  className={`${
                    isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white p-2 rounded-lg transition-colors shadow-sm hover:shadow-md`}
                  title={isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                >
                  <Volume2 size={20} />
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`${
                    copySuccess ? 'bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'
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
              <p className="text-teal-600 dark:text-teal-400 text-sm font-medium">✓ Copied to clipboard!</p>
            )}
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl p-5 max-h-80 overflow-y-auto shadow-inner">
              <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-300 leading-relaxed font-sans text-sm">{extractedText}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}