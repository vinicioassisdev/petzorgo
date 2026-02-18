
import React, { useState } from 'react';
import { Pet, PetType, Task, Frequency } from '../types';
import { COLORS, ROUTINE_TEMPLATES } from '../constants';

interface PetsProps {
  pets: Pet[];
  tasks: Task[];
  onAddPet: (pet: Pet) => void;
  onUpdatePet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

const Pets: React.FC<PetsProps> = ({
  pets, tasks, onAddPet, onUpdatePet, onDeletePet, onAddTask, onDeleteTask, onCompleteTask
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Form states for Pet
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petType, setPetType] = useState<PetType>(PetType.DOG);
  const [petSize, setPetSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [petGender, setPetGender] = useState<'male' | 'female'>('male');
  const [petWeight, setPetWeight] = useState('');
  const [petCoat, setPetCoat] = useState('');

  // Form states for Task
  const [taskName, setTaskName] = useState('');
  const [taskFreq, setTaskFreq] = useState<Frequency>(Frequency.DAILY);
  const [taskColor, setTaskColor] = useState(COLORS.taskColors[0]);
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddPet = () => {
    const newPet: Omit<Pet, 'id' | 'createdAt' | 'weightHistory'> = {
      name: petName,
      type: petType,
      breed: petBreed,
      size: petSize,
      gender: petGender,
      currentWeight: parseFloat(petWeight) || undefined,
      coatType: petCoat,
    };
    onAddPet(newPet);
    setPetName('');
    setPetBreed('');
    setPetWeight('');
    setPetCoat('');
    setShowAddModal(false);
  };

  const applyTemplate = (template: typeof ROUTINE_TEMPLATES[0]) => {
    setTaskName(template.name.split(' ')[0]); // Remove emoji for the formal name
    setTaskFreq(template.frequency as Frequency);
    setTaskColor(template.color);
  };

  const handleAddTask = () => {
    if (!selectedPet) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      petId: selectedPet.id,
      name: taskName,
      frequency: taskFreq,
      frequencyDays: taskFreq === Frequency.DAILY ? 1 : taskFreq === Frequency.WEEKLY ? 7 : 30,
      nextDate: taskDate,
      color: taskColor,
      completed: false
    };
    onAddTask(newTask);
    setTaskName('');
    setShowTaskModal(false);
  };

  const getPetEmoji = (type: PetType) => {
    switch (type) {
      case PetType.DOG: return '🐕';
      case PetType.CAT: return '🐱';
      case PetType.BIRD: return '🦜';
      case PetType.FISH: return '🐠';
      default: return '🐾';
    }
  };

  const translatePetType = (type: PetType) => {
    switch (type) {
      case PetType.DOG: return 'Cão';
      case PetType.CAT: return 'Gato';
      case PetType.BIRD: return 'Pássaro';
      case PetType.FISH: return 'Peixe';
      default: return 'Outro';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between slide-in">
        <h2 className="text-2xl font-black text-gray-800">Meus Pets 🐾</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 gradient-bg text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform text-sm"
        >
          + ADICIONAR
        </button>
      </div>

      <div className="grid gap-4 slide-in">
        {pets.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
            <span className="text-6xl block mb-4">🐕</span>
            <p className="text-gray-400 font-bold mb-4">Ainda nenhum pet cadastrado.</p>
          </div>
        ) : (
          pets.map(pet => {
            const petTasks = tasks.filter(t => t.petId === pet.id);
            return (
              <div
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-purple-200 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl">
                  {getPetEmoji(pet.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-gray-800 text-lg leading-tight">{pet.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    {translatePetType(pet.type)} {pet.breed ? `• ${pet.breed}` : ''}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                      {petTasks.length} rotinas
                    </span>
                  </div>
                </div>
                <span className="text-gray-300">❯</span>
              </div>
            );
          })
        )}
      </div>

      {/* Pet Detail Overlay */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[40px] p-8 space-y-6 slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center text-4xl">
                  {getPetEmoji(selectedPet.type)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800 leading-tight">{selectedPet.name}</h2>
                  <p className="text-gray-500 font-bold">
                    {translatePetType(selectedPet.type)}{selectedPet.breed ? ` • ${selectedPet.breed}` : ''}
                    {selectedPet.gender && ` • ${selectedPet.gender === 'male' ? 'Macho' : 'Fêmea'}`}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {selectedPet.currentWeight && (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {selectedPet.currentWeight} {selectedPet.weightUnit || 'kg'}
                      </span>
                    )}
                    {selectedPet.coatType && (
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Pelo: {selectedPet.coatType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedPet(null)} className="text-gray-400 text-3xl">&times;</button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-md hover:bg-purple-700 transition-colors"
              >
                + NOVA ROTINA
              </button>
              <button
                onClick={() => { if (confirm('Excluir este pet?')) { onDeletePet(selectedPet.id); setSelectedPet(null); } }}
                className="p-3 bg-red-50 text-red-500 font-bold rounded-2xl shadow-sm hover:bg-red-100 transition-colors"
              >
                🗑️
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rotinas Ativas</h3>
              {tasks.filter(t => t.petId === selectedPet.id).length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4 italic">Nenhuma rotina configurada.</p>
              ) : (
                tasks.filter(t => t.petId === selectedPet.id).map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }}></div>
                      <div>
                        <p className="font-bold text-gray-800 leading-tight">{task.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.frequency}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onCompleteTask(task.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">✓</button>
                      <button onClick={() => onDeleteTask(task.id)} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 space-y-4 slide-in shadow-2xl">
            <h2 className="text-2xl font-black text-gray-800">Cadastrar Pet</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Nome</label>
                <input
                  type="text"
                  placeholder="Ex: Totó"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Tipo</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value as PetType)}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                >
                  <option value={PetType.DOG}>Cão</option>
                  <option value={PetType.CAT}>Gato</option>
                  <option value={PetType.BIRD}>Pássaro</option>
                  <option value={PetType.FISH}>Peixe</option>
                  <option value={PetType.OTHER}>Outro</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Raça</label>
                <input
                  type="text"
                  placeholder="Ex: Golden Retriever"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Sexo</label>
                  <select
                    value={petGender}
                    onChange={(e) => setPetGender(e.target.value as 'male' | 'female')}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Peso (kg)</label>
                  <input
                    type="number"
                    placeholder="Ex: 10.5"
                    value={petWeight}
                    onChange={(e) => setPetWeight(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Tipo de Pelagem</label>
                <input
                  type="text"
                  placeholder="Ex: Longa, Curta, Lisa"
                  value={petCoat}
                  onChange={(e) => setPetCoat(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancelar</button>
              <button
                onClick={handleAddPet}
                disabled={!petName.trim()}
                className="flex-1 py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
              >
                SALVAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 space-y-4 slide-in shadow-2xl">
            <h2 className="text-2xl font-black text-gray-800">Nova Rotina</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {ROUTINE_TEMPLATES.map(template => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-colors bg-gray-50 text-gray-600"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Nome da rotina (ex: Alimentação)"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              />
              <select
                value={taskFreq}
                onChange={(e) => setTaskFreq(e.target.value as Frequency)}
                className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
              >
                <option value={Frequency.DAILY}>Diário</option>
                <option value={Frequency.WEEKLY}>Semanal</option>
                <option value={Frequency.MONTHLY}>Mensal</option>
              </select>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Data de Início</label>
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {COLORS.taskColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setTaskColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${taskColor === c ? 'scale-125 border-2 border-white shadow-md' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowTaskModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancelar</button>
              <button
                onClick={handleAddTask}
                disabled={!taskName.trim()}
                className="flex-1 py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
              >
                CRIAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;
