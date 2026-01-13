"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Download, Copy } from 'lucide-react';
import Link from 'next/link';

export default function SpeechToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    // Simulate processing - in real app, send to API
    setTimeout(() => {
      const mockTranscript = "This is a sample transcription of your speech. In a real implementation, this would be sent to a speech-to-text API like OpenAI Whisper or Google Speech-to-Text.";
      setTranscript(mockTranscript);
      setIsProcessing(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
    alert('Copied to clipboard!');
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/hub" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Hub
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            Speech to Text
          </h1>
          <div className="w-20" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recording Section */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-blue-400">Record Audio</h2>
            
            <div className="flex flex-col items-center justify-center py-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-600 hover:bg-red-500 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
              </motion.button>
              
              <p className="mt-4 text-slate-400">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
              
              {isRecording && (
                <motion.div
                  className="mt-4 flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-blue-400 rounded-full"
                      animate={{ height: [20, 40, 20] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            <div className="mt-6 p-4 bg-slate-800 rounded-lg">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Instructions</h3>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Click the microphone to start recording</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Click again to stop and transcribe</li>
                <li>• Transcript will appear on the right</li>
              </ul>
            </div>
          </div>

          {/* Transcript Section */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-400">Transcript</h2>
              {transcript && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadTranscript}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[300px] p-4 bg-slate-800 rounded-lg">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <motion.div
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="mt-4 text-slate-400">Processing audio...</p>
                </div>
              ) : transcript ? (
                <p className="text-slate-200 whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-slate-500 text-center">
                  Your transcript will appear here...
                </p>
              )}
            </div>

            {transcript && (
              <div className="mt-4 p-3 bg-slate-800 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Word count</span>
                  <span className="text-slate-200">{transcript.split(' ').length}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Character count</span>
                  <span className="text-slate-200">{transcript.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h3 className="font-medium text-white mb-2">🎯 High Accuracy</h3>
            <p className="text-sm text-slate-400">Advanced speech recognition with 95%+ accuracy</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h3 className="font-medium text-white mb-2">🌍 Multi-language</h3>
            <p className="text-sm text-slate-400">Support for 50+ languages and dialects</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <h3 className="font-medium text-white mb-2">⚡ Real-time</h3>
            <p className="text-sm text-slate-400">Fast transcription with instant results</p>
          </div>
        </div>
      </div>
    </div>
  );
}
