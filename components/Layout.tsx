
import React from 'react';
import { View, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: View;
  setView: (v: View) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, setView, onLogout }) => {
  const isExpired = user && !user.isAdmin &&
    (user.subscriptionStatus === 'expired' ||
      (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date()));

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: '🏠' },
    { id: 'pets', label: 'Pets', icon: '🐾' },
    { id: 'vaccines', label: 'Vacinas', icon: '💉' },
    { id: 'calendar', label: 'Agenda', icon: '📅' },
    { id: 'history', label: 'Histórico', icon: '📊' },
    { id: 'settings', label: 'Config', icon: '⚙️' },
  ].filter(item => {
    // Se expirado, só mostra Configurações e Assinatura (se tivesse)
    if (isExpired) {
      return item.id === 'settings' || item.id === 'subscription';
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50 max-w-lg mx-auto border-x shadow-2xl relative overflow-hidden">
      <header className="gradient-bg text-white p-4 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <h1 className="text-xl font-bold tracking-tight">PetZorgo</h1>
        </div>
        <button onClick={onLogout} className="p-2 rounded-full hover:bg-white/20 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-100 flex justify-around items-center py-2 px-1 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${currentView === item.id ? 'text-purple-600 scale-110' : 'text-gray-400'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
