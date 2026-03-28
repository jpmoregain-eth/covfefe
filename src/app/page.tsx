'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [speech, setSpeech] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSpeech = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setSpeech('');
    setCopied(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;
        setSpeech(fullText);
      }
    } catch (error) {
      console.error('Error generating speech:', error);
      setSpeech('Failed to generate speech. Sad! Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(speech);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateSpeech();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] text-white">
      {/* Stars background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '10%', left: '20%', opacity: 0.5 }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '20%', left: '80%', opacity: 0.3, animationDelay: '1s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '60%', left: '10%', opacity: 0.4, animationDelay: '2s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '80%', left: '70%', opacity: 0.6, animationDelay: '0.5s' }}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '40%', left: '90%', opacity: 0.5, animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] tracking-tight">
              🦅 COVFEFE
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-[#DAA520] font-semibold tracking-wide">
            The Best Words™
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            AI Trump Speech Generator - Tremendous, Believe Me!
          </p>
        </header>

        {/* Main Card */}
        <div className="bg-[#16213e] border-2 border-[#DAA520] rounded-lg shadow-[0_0_50px_rgba(218,165,32,0.3)] p-6 md:p-8 mb-8">
          {/* Input Section */}
          <div className="mb-6">
            <label htmlFor="topic" className="block text-[#FFD700] font-bold mb-3 text-lg">
              Enter Your Topic or Speech
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your topic or speech... (e.g., The economy, My neighbor Bob, Pineapple on pizza, Why cats are better than dogs)"
              className="w-full h-32 md:h-40 px-4 py-3 bg-[#0f1729] border-2 border-[#DAA520] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] focus:ring-opacity-50 transition-all resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 mt-2">
              Tip: Press Cmd/Ctrl + Enter to generate
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateSpeech}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-[#CC0000] to-[#990000] hover:from-[#FF0000] hover:to-[#CC0000] disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg text-lg md:text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none shadow-lg border-2 border-[#FFD700]"
          >
            {isGenerating ? '🎤 Generating Tremendous Speech...' : 'Make It Tremendous 🇺🇸'}
          </button>

          {/* Output Section */}
          {speech && (
            <div className="mt-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[#FFD700] font-bold text-lg">
                  Your Tremendous Speech
                </label>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-[#DAA520] hover:bg-[#FFD700] text-[#0a0a1a] font-semibold rounded transition-colors text-sm"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="bg-[#0f1729] border-2 border-[#DAA520] rounded-lg p-6 max-h-[500px] overflow-y-auto">
                <p className="text-white whitespace-pre-wrap leading-relaxed">
                  {speech}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm border-t border-gray-700 pt-6">
          <p className="mb-2">
            ⚠️ <span className="font-semibold">Disclaimer:</span> This is a parody/comedy site for entertainment purposes only.
          </p>
          <p>
            Not affiliated with, endorsed by, or representing any political figure or organization.
          </p>
          <p className="mt-4 text-xs text-gray-500">
            Powered by AI • Made with 🇺🇸 and a sense of humor
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
