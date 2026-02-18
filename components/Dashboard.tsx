
import React from 'react';
import { Pet, Task, View } from '../types';

interface DashboardProps {
  pets: Pet[];
  tasks: Task[];
  onCompleteTask: (id: string) => void;
  setView: (v: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pets, tasks, onCompleteTask, setView }) => {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayStr();
  const activeTasks = tasks.filter(t => !t.completed);
  const overdueTasks = tasks.filter(t => t.nextDate < todayStr && !t.completed);
  const todayTasks = tasks.filter(t => t.nextDate === todayStr && !t.completed);

  const stats = [
    { label: 'Ativas', value: activeTasks.length, icon: '📋', color: 'text-gray-800' },
    { label: 'Atrasadas', value: overdueTasks.length, icon: '⚠️', color: 'text-red-500' },
    { label: 'Hoje', value: todayTasks.length, icon: '📅', color: 'text-blue-500' },
    { label: 'Pets', value: pets.length, icon: '🐾', color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="slide-in">
        <h2 className="text-2xl font-extrabold text-gray-800">Olá! 👋</h2>
        <p className="text-gray-500 font-medium">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 slide-in">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-3xl mb-1">{s.icon}</span>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {todayTasks.length > 0 ? (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 slide-in">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🔔</span> Tarefas de Hoje
          </h3>
          <div className="space-y-3">
            {todayTasks.map(task => {
              const pet = pets.find(p => p.id === task.petId);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }}></div>
                    <div>
                      <p className="font-bold text-gray-800 leading-tight">{task.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{pet?.name || 'Pet'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onCompleteTask(task.id)}
                    className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors shadow-sm"
                  >
                    CONCLUIR
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center slide-in">
          <span className="text-5xl block mb-2">🎉</span>
          <p className="text-gray-500 font-bold">Tudo em dia por hoje!</p>
          <button
            onClick={() => setView('pets')}
            className="mt-4 text-purple-600 text-sm font-bold hover:underline"
          >
            Ver meus pets
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
