import React, { useState, useMemo } from 'react';
import { User, Pet, Task, View } from '../types';
import { reportService } from '../services/dbService';
import { supabase } from '../services/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SettingsProps {
  user: User;
  pets: Pet[];
  tasks: Task[];
  setView: (v: View) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, pets, tasks, setView }) => {
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Check if there is data older than 1 year
  const hasOldData = useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Check for old completed tasks or pets created a long time ago
    const oldTask = tasks.find(t => t.lastCompleted && new Date(t.lastCompleted) < oneYearAgo);
    return !!oldTask;
  }, [tasks]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const data = await reportService.getReportData(startDate, endDate, selectedPetId === 'all' ? undefined : selectedPetId);

      const doc = new jsPDF() as any;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(102, 126, 234);
      doc.text('Relatorio PetZorgo', 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Periodo: ${new Date(startDate).toLocaleDateString()} ate ${new Date(endDate).toLocaleDateString()}`, 14, 30);
      doc.text(`Usuario: ${user.name}`, 14, 35);

      let yPos = 45;

      // Pets Table
      if (data.pets.length > 0) {
        doc.setFontSize(14);
        doc.text('Pets', 14, yPos);
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Nome', 'Tipo', 'Raca', 'Peso']],
          body: data.pets.map(p => [p.name, p.type, p.breed || '-', `${p.currentWeight || '-'} kg`]),
          headStyles: { fillColor: '#667eea' }
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Tasks Table
      if (data.tasks.length > 0) {
        doc.setFontSize(14);
        doc.text('Rotinas', 14, yPos);
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Pet', 'Tarefa', 'Frequencia', 'Data']],
          body: data.tasks.map(t => {
            const pet = pets.find(p => p.id === t.petId);
            return [pet?.name || 'Unknown', t.name, t.frequency, new Date(t.nextDate).toLocaleDateString()];
          }),
          headStyles: { fillColor: '#764ba2' }
        });
        yPos = (doc as any).lastAutoTable.finalY + 15;
      }

      // Vaccines Table
      if (data.vaccines && data.vaccines.length > 0) {
        doc.setFontSize(14);
        doc.text('Vacinas', 14, yPos);
        autoTable(doc, {
          startY: yPos + 5,
          head: [['Pet', 'Vacina', 'Marca', 'Data', 'Veterinario']],
          body: data.vaccines.map(v => {
            const pet = pets.find(p => p.id === v.petId);
            return [pet?.name || 'Unknown', v.name, v.brand || '-', new Date(v.date).toLocaleDateString(), v.veterinarian || '-'];
          }),
          headStyles: { fillColor: '#8B5CF6' }
        });
      }

      doc.save(`relatorio_petzorgo_${startDate}_a_${endDate}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Falha ao gerar o relatório em PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm("Isso apagara permanentemente todos os registros com mais de 1 ano. Voce ja gerou seu relatorio?")) return;

    setIsCleaning(true);
    try {
      await reportService.deleteOldData();
      alert("Dados antigos removidos com sucesso!");
      window.location.reload();
    } catch (error) {
      alert("Erro ao realizar a limpeza.");
    } finally {
      setIsCleaning(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);

    if (error) {
      alert("Erro ao atualizar senha: " + error.message);
    } else {
      alert("Senha atualizada com sucesso!");
      setNewPassword('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="slide-in">
        <h2 className="text-2xl font-black text-gray-800">Configurações ⚙️</h2>
        <p className="text-gray-500 font-medium">Gerencie sua conta e dados</p>
      </div>

      {hasOldData && (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl slide-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="font-black text-blue-800 text-sm uppercase tracking-widest">Otimização de Performance</h4>
          </div>
          <p className="text-xs text-red-600 font-bold leading-relaxed mb-4">
            Você possui registros com mais de 1 ano. Para garantir a velocidade do app, gere seu relatório PDF e apague os dados antigos.
          </p>
          <button
            onClick={handleCleanup}
            disabled={isCleaning}
            className="w-full py-3 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200"
          >
            {isCleaning ? 'OTIMIZANDO...' : 'OTIMIZAR BANCO DE DADOS AGORA'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 slide-in space-y-4">
        <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-2xl font-black">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="font-black text-xl text-gray-800">{user.name}</p>
            <p className="text-sm font-medium text-gray-400">{user.email}</p>
            {(user.isAdmin || user.email === 'vinicioassisdev@gmail.com') && (
              <button
                onClick={() => setView('admin')}
                className="mt-2 text-[10px] font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-purple-200 transition-colors"
              >
                👑 Painel Admin
              </button>
            )}
          </div>
        </div>

        {/* Banner de Assinatura: Visível para todos que não são assinantes ativos ou admins */}
        {user.subscriptionStatus !== 'active' && (
          <div className="bg-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-200 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">💎</div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💎</span>
                <h3 className="font-black text-lg uppercase tracking-wider">Seja Pro!</h3>
              </div>
              <p className="text-sm font-medium opacity-90 mb-4 leading-relaxed">
                Desbloqueie todos os recursos, tenha pets ilimitados e garanta a melhor gestão para seus amigos.
              </p>
              <button
                onClick={() => window.location.href = 'https://pay.cakto.com.br/37tqkox_772784'}
                className="w-full py-3 bg-white text-purple-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
              >
                ASSINAR AGORA - R$ 19,90/mês
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 font-bold">Pets Cadastrados</span>
            <span className="font-black text-purple-600">{pets.length}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 font-bold">Total de Rotinas</span>
            <span className="font-black text-purple-600">{tasks.length}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 font-bold">Versão</span>
            <span className="text-gray-400 font-bold">2.3.0-admin</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 slide-in space-y-4">
        <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest flex items-center gap-2">
          🛡️ Política de Dados e Relatórios
        </h3>
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-[12px] text-blue-700 font-medium leading-relaxed">
            Para garantir a melhor performance, o PetZorgo mantém seu histórico completo por **1 ano**.
            Registros mais antigos são arquivados. Você pode gerar um relatório completo do período que desejar abaixo.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Selecionar Pet</label>
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold text-sm"
            >
              <option value="all">Todos os Pets</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Fim</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full py-4 gradient-bg text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isExporting ? 'GERANDO PDF...' : '📕 GERAR RELATÓRIO PDF'}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 slide-in space-y-4">
        <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest flex items-center gap-2">
          🔒 Segurança da Conta
        </h3>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-purple-500 font-bold"
          />
        </div>

        <button
          onClick={handleChangePassword}
          disabled={isUpdatingPassword || !newPassword}
          className="w-full py-4 bg-gray-800 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isUpdatingPassword ? 'ATUALIZANDO...' : 'ALTERAR MINHA SENHA'}
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 slide-in">
        <h3 className="font-black text-gray-800 mb-4 text-xs uppercase tracking-widest">Sobre o Zorgo</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          PetZorgo é sua ferramenta definitiva para garantir que seu melhor amigo tenha a melhor vida possível.
          Criado com amor para pais de pets exigentes.
        </p>
      </div>
    </div>
  );
};

export default Settings;
