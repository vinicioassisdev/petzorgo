
import React, { useState } from 'react';
import { Pet, Task, Event } from '../types';

interface CalendarProps {
  pets: Pet[];
  tasks: Task[];
  events: Event[];
}

// Converte qualquer string de data "YYYY-MM-DD" ou ISO para "YYYY-MM-DD" local sem shift de fuso
const toLocalDateStr = (dateStr: string): string => {
  if (!dateStr) return '';
  // Se já é YYYY-MM-DD puro, retorna direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Se é ISO com T, pega só a parte da data local
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTodayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const Calendar: React.FC<CalendarProps> = ({ pets, tasks, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedDay(null); };
  const nextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedDay(null); };

  const todayStr = getTodayStr();

  // Tarefas pendentes: apenas as que NÃO foram concluídas recentemente (nextDate é a próxima data)
  // Uma tarefa aparece no calendário apenas se nextDate >= hoje (futuras) OU nextDate === hoje (pendente hoje)
  const pendingTasks = tasks.filter(t => !t.completed);

  // Eventos: aparecem apenas se a data for >= hoje (futuros ou hoje)
  const upcomingEvents = events.filter(e => toLocalDateStr(e.date) >= todayStr);

  return (
    <div className="space-y-6 pb-20">
      <div className="slide-in">
        <h2 className="text-2xl font-black text-gray-800">Minha Agenda 📆</h2>
        <p className="text-gray-500 font-medium">Compromissos e tarefas pendentes</p>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 slide-in">
        <div className="flex items-center justify-between mb-6 px-2">
          <button onClick={prevMonth} className="text-2xl text-purple-600 font-bold hover:scale-125 transition-transform">❮</button>
          <h3 className="font-black text-gray-800 text-lg">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={nextMonth} className="text-2xl text-purple-600 font-bold hover:scale-125 transition-transform">❯</button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map(b => <div key={`blank-${b}`} />)}
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            // Apenas tarefas pendentes nesta data
            const dayTasks = pendingTasks.filter(t => toLocalDateStr(t.nextDate) === dateStr);
            // Apenas eventos futuros/hoje nesta data
            const dayEvents = upcomingEvents.filter(e => toLocalDateStr(e.date) === dateStr);

            const isToday = todayStr === dateStr;
            const isSelected = selectedDay === dateStr;
            const hasItems = dayTasks.length > 0 || dayEvents.length > 0;

            return (
              <div
                key={day}
                onClick={() => hasItems ? setSelectedDay(isSelected ? null : dateStr) : null}
                className={`min-h-[52px] p-1 rounded-xl flex flex-col items-center border transition-all cursor-default ${isSelected
                    ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-300'
                    : isToday
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-4 ring-purple-100'
                      : hasItems
                        ? 'bg-gray-50 border-gray-200 cursor-pointer hover:border-purple-300'
                        : 'bg-gray-50 border-transparent'
                  }`}
              >
                <span className={`text-xs font-black mb-0.5 ${isToday ? 'text-white' : isSelected ? 'text-purple-700' : 'text-gray-800'}`}>{day}</span>
                <div className="flex flex-wrap gap-0.5 justify-center max-w-full">
                  {dayTasks.map(t => (
                    <div
                      key={t.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isToday ? '#fff' : t.color || '#8B5CF6' }}
                    />
                  ))}
                  {dayEvents.map(e => (
                    <div
                      key={e.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isToday ? '#fff' : '#F59E0B' }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalhe do dia selecionado */}
      {selectedDay && (() => {
        const dayTasks = pendingTasks.filter(t => toLocalDateStr(t.nextDate) === selectedDay);
        const dayEvents = upcomingEvents.filter(e => toLocalDateStr(e.date) === selectedDay);
        const [y, m, d] = selectedDay.split('-');
        const label = `${d}/${m}/${y}`;
        return (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 slide-in">
            <h4 className="font-black text-gray-800 mb-3 text-sm uppercase tracking-widest">📅 {label}</h4>
            <div className="space-y-2">
              {dayTasks.map(t => {
                const pet = pets.find(p => p.id === t.petId);
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: t.color || '#8B5CF6' }} />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{pet?.name || 'Pet'} · {t.frequency}</p>
                    </div>
                  </div>
                );
              })}
              {dayEvents.map(e => {
                const pet = pets.find(p => p.id === e.petId);
                return (
                  <div key={e.id} className="flex items-center gap-3 p-3 rounded-2xl bg-yellow-50">
                    <div className="w-3 h-3 rounded-full flex-shrink-0 bg-yellow-400" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">🎉 {e.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{pet?.name || 'Pet'} · Evento</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Próximos compromissos */}
      {(() => {
        const upcoming = [
          ...pendingTasks
            .filter(t => toLocalDateStr(t.nextDate) >= todayStr)
            .map(t => ({ type: 'task' as const, date: toLocalDateStr(t.nextDate), item: t })),
          ...upcomingEvents
            .map(e => ({ type: 'event' as const, date: toLocalDateStr(e.date), item: e }))
        ]
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 5);

        if (upcoming.length === 0) return null;

        return (
          <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 slide-in">
            <h4 className="font-black text-gray-800 mb-3 text-xs uppercase tracking-widest">🔔 Próximos Compromissos</h4>
            <div className="space-y-2">
              {upcoming.map((u, i) => {
                const [y, m, d] = u.date.split('-');
                const label = `${d}/${m}`;
                const isTaskItem = u.type === 'task';
                const taskItem = isTaskItem ? u.item as Task : null;
                const eventItem = !isTaskItem ? u.item as Event : null;
                const pet = pets.find(p => p.id === (taskItem?.petId || eventItem?.petId));
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
                    <span className="text-xs font-black text-purple-600 w-10 text-center flex-shrink-0">{label}</span>
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isTaskItem ? (taskItem?.color || '#8B5CF6') : '#F59E0B' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">
                        {isTaskItem ? taskItem?.name : `🎉 ${eventItem?.name}`}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{pet?.name || 'Pet'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 slide-in">
        <h4 className="font-black text-gray-800 mb-3 text-xs uppercase tracking-widest">Legenda</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-purple-600 flex-shrink-0"></div>
            <span className="text-[9px] font-black text-purple-800 uppercase">Hoje</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
            <span className="text-[9px] font-black text-blue-800 uppercase">Rotinas</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></div>
            <span className="text-[9px] font-black text-yellow-800 uppercase">Eventos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
