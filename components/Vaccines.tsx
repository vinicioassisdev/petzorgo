
import React, { useState } from 'react';
import { Pet, Vaccine } from '../types';

interface VaccinesProps {
    pets: Pet[];
    vaccines: Vaccine[];
    onAddVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
    onDeleteVaccine: (id: string) => void;
}

const Vaccines: React.FC<VaccinesProps> = ({ pets, vaccines, onAddVaccine, onDeleteVaccine }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [vaccineName, setVaccineName] = useState('');
    const [brand, setBrand] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [veterinarian, setVeterinarian] = useState('');
    const [clinic, setClinic] = useState('');

    const handleAddVaccine = () => {
        if (!selectedPetId || !vaccineName || !date) return;
        onAddVaccine({
            petId: selectedPetId,
            name: vaccineName,
            brand: brand || undefined,
            date,
            veterinarian: veterinarian || undefined,
            clinic: clinic || undefined
        });
        setShowModal(false);
        resetForm();
    };

    const resetForm = () => {
        setSelectedPetId('');
        setVaccineName('');
        setBrand('');
        setDate(new Date().toISOString().split('T')[0]);
        setVeterinarian('');
        setClinic('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center slide-in">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">Vacinas 💉</h2>
                    <p className="text-gray-500 font-medium">Controle de imunização</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-200 hover:scale-105 transition-transform"
                >
                    +
                </button>
            </div>

            <div className="space-y-4">
                {vaccines.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 slide-in">
                        <span className="text-4xl mb-4 block">🩹</span>
                        <p className="text-gray-400 font-bold">Nenhuma vacina registrada.</p>
                    </div>
                ) : (
                    vaccines.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(v => {
                        const pet = pets.find(p => p.id === v.petId);
                        return (
                            <div key={v.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 slide-in flex justify-between items-center group">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">💉</div>
                                    <div>
                                        <h4 className="font-black text-gray-800">{v.name}</h4>
                                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{pet?.name || 'Pet'}</p>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-full font-bold text-gray-400">📅 {new Date(v.date).toLocaleDateString('pt-BR')}</span>
                                            {v.brand && <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-full font-bold text-gray-400">🏷️ {v.brand}</span>}
                                            {v.veterinarian && <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded-full font-bold text-gray-400">👨‍⚕️ {v.veterinarian}</span>}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDeleteVaccine(v.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-300 hover:text-red-500 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-8 space-y-4 slide-in shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-black text-gray-800">Nova Vacina</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Pet</label>
                                <select
                                    value={selectedPetId}
                                    onChange={(e) => setSelectedPetId(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                >
                                    <option value="">Selecionar Pet</option>
                                    {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Nome da Vacina</label>
                                <input
                                    type="text"
                                    placeholder="Ex: V10, Antirrábica"
                                    value={vaccineName}
                                    onChange={(e) => setVaccineName(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Marca / Lab</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Zoetis, MSD"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Data</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Veterinário</label>
                                    <input
                                        type="text"
                                        placeholder="Nome"
                                        value={veterinarian}
                                        onChange={(e) => setVeterinarian(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Clínica</label>
                                <input
                                    type="text"
                                    placeholder="Nome da clínica"
                                    value={clinic}
                                    onChange={(e) => setClinic(e.target.value)}
                                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-gray-400">Cancelar</button>
                            <button
                                onClick={handleAddVaccine}
                                disabled={!vaccineName || !selectedPetId}
                                className="flex-1 py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
                            >
                                SALVAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vaccines;
