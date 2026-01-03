
import React, { useState, useRef, useEffect } from 'react';
import { Message, RestaurantData } from '../types';
import { geminiService } from '../services/geminiService';

interface ChatInterfaceProps {
  restaurantData: RestaurantData;
  onReset: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ restaurantData, onReset }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Dzień dobry! Jestem wirtualnym asystentem restauracji ${restaurantData.nazwa}. W czym mogę dzisiaj pomóc? Mogę odpowiedzieć na pytania o nasze menu, godziny otwarcia lub pomóc w rezerwacji stolika.`,
      timestamp: new Date()
    }
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      let fullResponse = '';
      const stream = geminiService.sendMessageStream(input);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantId ? { ...msg, content: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden mx-auto">
      {/* Header */}
      <div className="bg-stone-900 p-6 flex justify-between items-center">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">{restaurantData.nazwa}</h2>
          <p className="text-stone-400 text-xs uppercase tracking-widest font-medium">Wirtualny Recepcjonista</p>
        </div>
        <button 
          onClick={onReset}
          className="text-stone-400 hover:text-white text-sm transition-colors"
        >
          Zmień dane
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-stone-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none'
                  : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content || (isLoading && msg.role === 'assistant' ? '...' : '')}</p>
              <span className={`text-[10px] block mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Wpisz wiadomość..."
          disabled={isLoading}
          className="flex-1 p-3 bg-stone-100 border-none rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
