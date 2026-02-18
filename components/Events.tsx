
import React, { useState } from 'react';
import { Pet, Event } from '../types';

interface EventsProps {
  pets: Pet[];
  events: Event[];
  onAddEvent: (e: Event) => void;
  onDeleteEvent: (id: string) => void;
}

const Events: React.FC<EventsProps> = ({ pets, events, onAddEvent, onDeleteEvent }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventPetId, setEventPetId] = useState(pets[0]?.id || '');

  const handleAdd = () => {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      petId: eventPetId,
      name: eventName,
      date: eventDate,
    };
    onAddEvent(newEvent);
    setEventName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between slide-in">
        <h2 className="text-2xl font-black text-gray-800">Eventos 🎉</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 gradient-bg text-white font-bold rounded-xl shadow-lg"
        >
          + CRIAR
        </button>
      </div>

      <div className="space-y-4 slide-in">
        {events.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
            <span className="text-5xl block mb-2">🎈</span>
            <p className="text-gray-400 font-bold">Nenhum evento futuro.</p>
          </div>
        ) : (
          events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => {
            const pet = pets.find(p => p.id === event.petId);
            return (
              <div key={event.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-2xl">🎉</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{event.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{pet?.name || 'Pet'}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-xs font-black text-purple-600">
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </span>
                  <button onClick={() => onDeleteEvent(event.id)} className="text-red-400 hover:text-red-600 transition-colors">🗑️</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 space-y-4 slide-in shadow-2xl">
            <h2 className="text-2xl font-black text-gray-800">Novo Evento</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nome do evento" 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              />
              <input 
                type="date" 
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              />
              <select 
                value={eventPetId}
                onChange={(e) => setEventPetId(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              >
                {pets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg">CRIAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
