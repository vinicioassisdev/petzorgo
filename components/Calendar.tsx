
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

  return (
    <div className="space-y-6">
      <div className="slide-in">
        <h2 className="text-2xl font-black text-gray-800">Minha Agenda 📆</h2>
        <p className="text-gray-500 font-medium">Acompanhe os próximos compromissos</p>
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
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div 
                key={day} 
                className={`min-h-[60px] p-1 rounded-xl flex flex-col items-center border transition-all ${
                  isToday ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-50 border-transparent'
                }`}
              >
                <span className={`text-sm font-black mb-1 ${isToday ? 'text-white' : 'text-gray-800'}`}>{day}</span>
                <div className="flex flex-wrap gap-1 justify-center">
                  {dayTasks.map(t => (
                    <div 
                      key={t.id} 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ backgroundColor: isToday ? '#fff' : t.color }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 slide-in">
        <h4 className="font-black text-gray-800 mb-4 text-xs uppercase tracking-widest">Legenda</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="text-xs font-bold text-gray-500">Hoje</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-bold text-gray-500">Tarefas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
