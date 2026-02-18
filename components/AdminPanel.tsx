
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/dbService';

const AdminPanel: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                const [statsData, usersData] = await Promise.all([
                    adminService.getStats(),
                    adminService.getSubscribers()
                ]);
                setStats(statsData);
                setUsers(usersData);
            } catch (err: any) {
                setError('Acesso negado ou erro ao carregar dados. Apenas administradores podem ver este painel.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadAdminData();
    }, []);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold">Carregando painel de controle...</p>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 p-8 rounded-3xl text-center border border-red-100 slide-in">
            <span className="text-4xl mb-4 block">🚫</span>
            <h3 className="text-red-800 font-black mb-2">{error}</h3>
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="slide-in flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">Painel ADM 👑</h2>
                    <p className="text-gray-500 font-medium">Gestão global do PetZorgo</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'stats' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
                    >
                        MÉTRICAS
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'users' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}
                    >
                        USUÁRIOS
                    </button>
                </div>
            </div>

            {activeTab === 'stats' ? (
                <>
                    <div className="grid grid-cols-2 gap-4 slide-in">
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Usuários</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black text-purple-600">{stats.totalUsers}</span>
                                <span className="text-[10px] font-bold text-green-500 mb-1">+{stats.growth.newUsers} (30d)</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Pets</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-black text-purple-600">{stats.totalPets}</span>
                                <span className="text-[10px] font-bold text-green-500 mb-1">+{stats.growth.newPets} (30d)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 slide-in">
                        <h3 className="font-black text-gray-800 mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                            📊 Saúde do Sistema
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🛠️</span>
                                    <span className="font-bold text-gray-700">Estado do Banco</span>
                                </div>
                                <span className="text-[10px] font-black bg-green-100 text-green-600 px-3 py-1 rounded-full uppercase">Saudável</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-600 text-white p-8 rounded-[40px] slide-in shadow-xl shadow-purple-200">
                        <h3 className="font-black text-xl mb-2">Relatório de Crescimento</h3>
                        <p className="text-purple-100 text-sm opacity-90 leading-relaxed">
                            O sistema cresceu {(stats.growth.newUsers / (stats.totalUsers || 1) * 100).toFixed(1)}% em novos usuários nos últimos 30 dias.
                        </p>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 slide-in overflow-hidden">
                    <h3 className="font-black text-gray-800 mb-6 text-xs uppercase tracking-widest px-2">
                        👥 Gestão de Assinantes
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-tighter border-b border-gray-50">
                                    <th className="px-2 py-4">Usuário / Email</th>
                                    <th className="px-2 py-4 text-center">Status</th>
                                    <th className="px-2 py-4 text-right">Acesso Até</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((u) => (
                                    <tr key={u.ID} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-2 py-4">
                                            <p className="font-bold text-gray-800 text-sm">{u.NOME || 'Sem Nome'}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">{u.EMAIL}</p>
                                        </td>
                                        <td className="px-2 py-4 text-center">
                                            <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${u.STATUS === 'active' ? 'bg-green-100 text-green-600' :
                                                    u.STATUS === 'trial' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-red-100 text-red-600'
                                                }`}>
                                                {u.STATUS === 'active' ? 'Assinante' : u.STATUS === 'trial' ? 'Teste' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-4 text-right">
                                            <p className="text-[10px] font-black text-gray-600">
                                                {u.ACESSO_ATE ? new Date(u.ACESSO_ATE).toLocaleDateString('pt-BR') : 'Sem data'}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
