// pages/voice-recorder/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { Play, Pause, StopCircle, Mic, Trash2, Download } from "lucide-react";

export default function VoiceRecorderPage() {
  const recorderControls = useAudioRecorder();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (recorderControls.recordingBlob) {
      setAudioBlob(recorderControls.recordingBlob);
      setAudioUrl(URL.createObjectURL(recorderControls.recordingBlob));
    }
  }, [recorderControls.recordingBlob]);

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setAudioUrl(URL.createObjectURL(blob));
  };

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = "recorded_audio.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleClear = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    // recorderControls.stop(); // Ensure recorder is stopped
  };

  const isRecording = recorderControls.isRecording;
  const isPaused = recorderControls.isPaused;
  const recordingBlob = recorderControls.recordingBlob;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Voice Recorder
        </h1>

        <div className="flex justify-center mb-8">
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            recorderControls={recorderControls}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            onNotAllowedOrFound={(err) => console.table(err)}
            downloadFileExtension="webm"
            showVisualizer={true}
          />
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={recorderControls.startRecording}
            disabled={isRecording}
            className={`p-3 rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-red-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            }`}
            title="Start Recording"
          >
            <Mic size={24} />
          </button>

          <button
            onClick={recorderControls.stopRecording}
            disabled={!isRecording && !isPaused && !recordingBlob}
            className={`p-3 rounded-full transition-all duration-300 ${
              !isRecording && !isPaused && !recordingBlob
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
            }`}
            title="Stop Recording"
          >
            <StopCircle size={24} />
          </button>

          <button
            onClick={recorderControls.togglePauseResume}
            disabled={!isRecording && !isPaused}
            className={`p-3 rounded-full transition-all duration-300 ${
              !isRecording && !isPaused
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            }`}
            title={isPaused ? "Resume Recording" : "Pause Recording"}
          >
            {isPaused ? <Play size={24} /> : <Pause size={24} />}
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
                className="flex items-center space-x-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
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
              href="https://www.npmjs.com/package/react-audio-voice-recorder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              react-audio-voice-recorder
            </a>{" "}
            and{" "}
            <a
              href="https://lucide.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline"
            >
              Lucide Icons
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
