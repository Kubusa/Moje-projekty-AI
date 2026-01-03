
import React, { useState } from 'react';
import { RestaurantData, ChatState } from './types';
import { DEFAULT_RESTAURANT } from './constants';
import ConfigurationPanel from './components/ConfigurationPanel';
import ChatInterface from './components/ChatInterface';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>('configuring');
  const [restaurantData, setRestaurantData] = useState<RestaurantData>(DEFAULT_RESTAURANT);

  const handleStartChat = () => {
    geminiService.initChat(restaurantData);
    setState('chatting');
  };

  const handleReset = () => {
    setState('configuring');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative Top Bar */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-800 w-full" />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl flex flex-col gap-8">
          
          <header className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-stone-900">
              Wirtualny <span className="text-amber-600 italic">Recepcjonista</span>
            </h1>
            <p className="text-stone-500 font-light max-w-xl mx-auto uppercase tracking-widest text-sm">
              Sztuczna Inteligencja dla Twojej Restauracji
            </p>
          </header>

          <div className="flex justify-center transition-all duration-500">
            {state === 'configuring' ? (
              <ConfigurationPanel 
                data={restaurantData} 
                onChange={setRestaurantData} 
                onSave={handleStartChat} 
              />
            ) : (
              <ChatInterface 
                restaurantData={restaurantData} 
                onReset={handleReset} 
              />
            )}
          </div>

          {state === 'chatting' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-stone-600">Asystent AI aktywny: {restaurantData.nazwa}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-stone-400 text-sm border-t border-stone-100">
        &copy; {new Date().getFullYear()} Restauracja Manager Pro. System oparty na technologii Gemini AI.
      </footer>
    </div>
  );
};

export default App;
