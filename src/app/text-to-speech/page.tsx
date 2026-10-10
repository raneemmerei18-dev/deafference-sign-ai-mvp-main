'use client'

import { useState, useRef } from 'react'
import { Volume2, Copy, Trash2 } from 'lucide-react'
import WaveformAnimation from '@/components/deafference/waveform-animation'

const QUICK_PHRASES = [
  'Yes',
  'No',
  'One moment please',
  'Can you repeat that?'
]

export default function TextToSpeechPage() {
  const [text, setText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const handleSpeak = () => {
    if (!text.trim()) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current = utterance
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const addQuickPhrase = (phrase: string) => {
    setText(prev => prev ? `${prev} ${phrase}` : phrase)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Text to Speech</h1>
          <p className="text-lg text-gray-700">
            Type or select phrases to speak out loud
          </p>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            What would you like to say?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-black placeholder-gray-500"
          />
          <p className="text-sm text-gray-600 mt-2">
            {text.length} characters
          </p>
        </div>

        {/* Quick Phrases */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-black mb-3">
            Quick phrases
          </label>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => addQuickPhrase(phrase)}
                className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium rounded-lg transition-colors border-2 border-blue-300"
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Waveform Animation */}
        {isSpeaking && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="mb-2 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-900">Speaking now...</p>
            </div>
            <WaveformAnimation isActive={isSpeaking} />
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSpeak}
            disabled={!text.trim() || isSpeaking}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            {isSpeaking ? 'Speaking...' : 'Listen / Speak Out Loud'}
          </button>

          {isSpeaking && (
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Stop
            </button>
          )}
        </div>

        {/* Utility Buttons */}
        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => setText('')}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Accessibility Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-600">
          <p className="text-sm text-gray-700">
            ℹ️ <strong>Accessibility:</strong> The waveform animation provides visual feedback when audio is playing, helping deaf and hard-of-hearing users confirm the system is actively speaking.
          </p>
        </div>
      </div>
    </div>
  )
}
