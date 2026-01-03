
import React from 'react';
import { RestaurantData } from '../types';

interface ConfigurationPanelProps {
  data: RestaurantData;
  onChange: (data: RestaurantData) => void;
  onSave: () => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ data, onChange, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 max-w-2xl w-full mx-auto">
      <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">Konfiguracja Restauracji</h2>
      <p className="text-stone-500 mb-8 text-center">Wprowadź dane swojej restauracji, aby asystent mógł udzielać poprawnych informacji.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-stone-700">Nazwa Restauracji</label>
          <input
            name="nazwa"
            value={data.nazwa}
            onChange={handleChange}
            className="p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            placeholder="np. Restauracja Amore"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-stone-700">Telefon</label>
          <input
            name="telefon"
            value={data.telefon}
            onChange={handleChange}
            className="p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            placeholder="+48 22 123 45 67"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-stone-700">Adres</label>
          <input
            name="adres"
            value={data.adres}
            onChange={handleChange}
            className="p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            placeholder="ul. Piękna 12, Warszawa"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-stone-700">Godziny Otwarcia</label>
          <input
            name="godziny"
            value={data.godziny}
            onChange={handleChange}
            className="p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            placeholder="np. Pon-Pt: 12-22, Sob-Nd: 12-23"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-stone-700">Menu (Opis potraw)</label>
          <textarea
            name="menu"
            value={data.menu}
            onChange={handleChange}
            rows={4}
            className="p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all resize-none"
            placeholder="Opisz krótko co serwujecie..."
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-stone-700">Link do rezerwacji</label>
          <input
            name="link"
            value={data.link}
            onChange={handleChange}
            className="p-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
            placeholder="https://twojastrona.pl/rezerwacje"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        className="mt-10 w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-amber-900/10"
      >
        Uruchom Asystenta
      </button>
    </div>
  );
};

export default ConfigurationPanel;
