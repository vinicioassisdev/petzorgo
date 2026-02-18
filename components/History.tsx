
import React from 'react';
import { Pet, Task } from '../types';

interface HistoryProps {
  pets: Pet[];
  tasks: Task[];
}

const History: React.FC<HistoryProps> = ({ pets, tasks }) => {
  const completedTasks = tasks.filter(t => t.lastCompleted);
  const totalTasks = tasks.length;
  const rate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="slide-in">
        <h2 className="text-2xl font-black text-gray-800">Histórico 📊</h2>
        <p className="text-gray-500 font-medium">Desempenho nos cuidados</p>
      </div>

      <div className="grid grid-cols-2 gap-4 slide-in">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-3xl mb-2">✅</span>
          <p className="text-3xl font-black text-green-600">{completedTasks.length}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Concluídas</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-3xl mb-2">📈</span>
          <p className="text-3xl font-black text-purple-600">{rate}%</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Eficiência</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 slide-in">
        <h3 className="font-black text-gray-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
          Recentes
        </h3>
        <div className="space-y-4">
          {completedTasks.length === 0 ? (
            <p className="text-center text-gray-400 font-bold py-4">Nenhum registro encontrado.</p>
          ) : (
            completedTasks.sort((a, b) => new Date(b.lastCompleted!).getTime() - new Date(a.lastCompleted!).getTime()).map(task => {
              const pet = pets.find(p => p.id === task.petId);
              return (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">✅</div>
                    <div>
                      <p className="font-bold text-gray-800">{task.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{pet?.name || 'Pet'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    {new Date(task.lastCompleted!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
