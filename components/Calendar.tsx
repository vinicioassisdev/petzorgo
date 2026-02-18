
import React, { useState } from 'react';
import { Pet, Task, Event } from '../types';

interface CalendarProps {
  pets: Pet[];
  tasks: Task[];
  events: Event[];
}

const Calendar: React.FC<CalendarProps> = ({ pets, tasks, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Helper to get local YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getTodayStr();

  return (
    <div className="space-y-6 pb-20">
      <div className="slide-in">
        <h2 className="text-2xl font-black text-gray-800">Minha Agenda 📆</h2>
        <p className="text-gray-500 font-medium">Acompanhe compromissos, tarefas e vacinas</p>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 slide-in">
        <div className="flex items-center justify-between mb-6 px-2">
          <button onClick={prevMonth} className="text-2xl text-purple-600 font-bold hover:scale-125 transition-transform">❮</button>
          <h3 className="font-black text-gray-800 text-lg">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={nextMonth} className="text-2xl text-purple-600 font-bold hover:scale-125 transition-transform">❯</button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {blanks.map(b => <div key={`blank-${b}`} className="p-2"></div>)}
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const dayTasks = tasks.filter(t => t.nextDate === dateStr);
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = todayStr === dateStr;

            return (
              <div
                key={day}
                className={`min-h-[70px] p-1 rounded-xl flex flex-col items-center border transition-all ${isToday ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-4 ring-purple-100' : 'bg-gray-50 border-transparent'
                  }`}
              >
                <span className={`text-sm font-black mb-1 ${isToday ? 'text-white' : 'text-gray-800'}`}>{day}</span>
                <div className="flex flex-wrap gap-1 justify-center max-w-full">
                  {dayTasks.map(t => (
                    <div
                      key={t.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isToday ? '#fff' : t.color }}
                      title={t.name}
                    />
                  ))}
                  {dayEvents.map(e => (
                    <div
                      key={e.id}
                      className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      style={isToday ? { backgroundColor: '#fff' } : {}}
                      title={e.name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 slide-in">
        <h4 className="font-black text-gray-800 mb-4 text-xs uppercase tracking-widest">Legenda</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="text-[10px] font-black text-purple-800 uppercase">Hoje</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-black text-blue-800 uppercase">Tarefas</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-[10px] font-black text-yellow-800 uppercase">Eventos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
