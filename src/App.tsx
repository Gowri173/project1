import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

interface Message {
  role: 'user' | 'ai';
  content: string;
  id: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am your Gemini-powered assistant. How can I help you today?', id: 'initial' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      id: Date.now().toString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
      });

      const aiMessage: Message = {
        role: 'ai',
        content: response.text || 'Sorry, I couldn\'t generate a response.',
        id: (Date.now() + 1).toString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Error: Could not connect to Gemini. Please check your API key in the environmental secrets.',
        id: (Date.now() + 1).toString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Gemini Brain</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 rounded-full border border-neutral-800">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Active</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-24 pb-32">
        <div className="space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  message.role === 'ai' 
                    ? 'bg-neutral-900 border-neutral-800 text-indigo-400' 
                    : 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                }`}>
                  {message.role === 'ai' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] rounded-3xl px-6 py-4 text-base leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-neutral-800 text-white rounded-tr-none'
                    : 'bg-neutral-900/50 border border-neutral-800 text-neutral-100 rounded-tl-none'
                }`}>
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl rounded-tl-none px-6 py-4">
                <span className="text-neutral-400 italic">Gemini is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 w-full bg-neutral-950/80 backdrop-blur-md px-4 py-6 border-t border-neutral-800">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative group"
        >
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini anything..."
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl py-4 pl-6 pr-16 text-white placeholder-neutral-500 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          <button
            id="send-button"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-500/10"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-neutral-600 mt-4 uppercase tracking-[0.2em] font-medium">
          Powered by Google Gemini 3 Flash
        </p>
      </footer>
    </div>
  );
}
