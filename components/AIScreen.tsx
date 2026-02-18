
import React, { useState } from 'react';
import { Pet } from '../types';
import { getPetAdvice } from '../services/geminiService';

interface AIScreenProps {
  pets: Pet[];
}

const AIScreen: React.FC<AIScreenProps> = ({ pets }) => {
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!query.trim() || !selectedPetId) return;
    setLoading(true);
    setResponse(null);
    const pet = pets.find(p => p.id === selectedPetId);
    if (pet) {
      const advice = await getPetAdvice(pet, query);
      setResponse(advice);
    }
    setLoading(false);
  };

  const suggestions = [
    "Qual a melhor ração para minha raça?",
    "Quantas vezes devo passear por dia?",
    "Meu pet está comendo grama, é normal?",
    "Como introduzir um novo pet em casa?"
  ];

  return (
    <div className="space-y-6">
      <div className="slide-in">
        <h2 className="text-2xl font-black text-gray-800">Zorgo AI ✨</h2>
        <p className="text-gray-500 font-medium">Consultoria inteligente para seu melhor amigo</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 slide-in space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sobre qual pet?</label>
          <select 
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            {pets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sua Pergunta</label>
          <textarea 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Qual a frequência ideal de banho?"
            className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none h-28 resize-none"
          />
        </div>

        <button 
          onClick={handleAsk}
          disabled={loading || !query.trim()}
          className="w-full py-4 rounded-2xl gradient-bg text-white font-black text-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? 'ANALISANDO...' : 'CONSULTAR IA'}
        </button>
      </div>

      {response && (
        <div className="bg-white rounded-3xl p-6 shadow-md border-l-4 border-purple-500 slide-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💡</span>
            <h3 className="font-bold text-gray-800">Resposta do Zorgo</h3>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
            {response}
          </div>
        </div>
      )}

      <div className="space-y-3 slide-in">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Sugestões de Perguntas</h3>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button 
              key={s}
              onClick={() => setQuery(s)}
              className="px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIScreen;
