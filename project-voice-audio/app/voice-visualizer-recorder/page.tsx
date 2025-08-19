"use client";

import React, { useState, useRef, useEffect } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { Play, Pause, StopCircle, Mic, Trash2, Download } from "lucide-react";

export default function VoiceVisualizerRecorderPage() {
  const recorderControls = useVoiceVisualizer();
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    isRecordingInProgress,
  } = recorderControls;

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (recorderControls.recordedBlob) {
      const url = URL.createObjectURL(recorderControls.recordedBlob);
      setAudioUrl(url);
    }
  }, [recorderControls.recordedBlob]);

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = "recorded_audio_visualizer.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleClear = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    recorderControls.clearCanvas(); // Corrected: Use clearCanvas
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600">
          Voice Visualizer Recorder
        </h1>

        <div className="flex justify-center mb-8">
          <VoiceVisualizer
            controls={recorderControls} // Corrected: Use controls prop
          />
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={startRecording}
            disabled={isRecordingInProgress}
            className={`p-3 rounded-full transition-all duration-300 ${
              isRecordingInProgress
                ? "bg-red-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            }`}
            title="Start Recording"
          >
            <Mic size={24} />
          </button>

          <button
            onClick={stopRecording}
            disabled={!isRecordingInProgress && !recorderControls.isPausedRecording && !recorderControls.recordedBlob} // Corrected: Access isPaused and recordedBlob via recorderControls
            className={`p-3 rounded-full transition-all duration-300 ${
              !isRecordingInProgress && !recorderControls.isPausedRecording && !recorderControls.recordedBlob
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            }`}
            title="Stop Recording"
          >
            <StopCircle size={24} />
          </button>

          <button
            onClick={togglePauseResume}
            disabled={!isRecordingInProgress && !recorderControls.isPausedRecording} // Corrected: Access isPaused via recorderControls
            className={`p-3 rounded-full transition-all duration-300 ${
              !isRecordingInProgress && !recorderControls.isPausedRecording
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            }`}
            title={recorderControls.isPausedRecording ? "Resume Recording" : "Pause Recording"} // Corrected: Access isPaused via recorderControls
          >
            {recorderControls.isPausedRecording ? <Play size={24} /> : <Pause size={24} />}
          </button>
        </div>

        {audioUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              Recorded Audio
            </h2>
            <audio
              src={audioUrl}
              controls
              className="w-full rounded-lg bg-gray-700 p-2 mb-4"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
              >
                <Download size={20} />
                <span>Download</span>
              </button>
              <button
                onClick={handleClear}
                className="flex items-center space-x-2 px-5 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
              >
                <Trash2 size={20} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Powered by{" "}
            <a
              href="https://www.npmjs.com/package/react-voice-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              react-voice-visualizer
            </a>{" "}
            and{" "}
            <a
              href="https://lucide.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              Lucide Icons
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
