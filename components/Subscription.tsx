
import React, { useState } from 'react';
import { User } from '../types';

interface SubscriptionProps {
    user: User;
}

const Subscription: React.FC<SubscriptionProps> = ({ user }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const isExpired = user.subscriptionStatus === 'expired' ||
        (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date());

    const handleSubscribe = () => {
        setLoading('monthly');
        // Redirecionamento direto para o checkout da Cakto
        window.location.href = 'https://pay.cakto.com.br/37tqkox_772784';
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4 max-w-md">
                <div className="inline-flex p-4 bg-purple-100 rounded-[32px] text-purple-600 mb-2">
                    <span className="text-4xl">💎</span>
                </div>
                <h2 className="text-3xl font-black text-gray-800 leading-tight">
                    {isExpired ? "Sua assinatura expirou" : "PetZorgo Premium"}
                </h2>
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mx-auto">
                    🚀 TESTE GRÁTIS POR 7 DIAS
                </div>
                <p className="text-gray-500 font-medium leading-relaxed mt-4">
                    Experimente todas as funções premium gratuitamente por 7 dias. Sem compromisso.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 w-full max-w-sm">
                {/* Plano Mensal Profissional */}
                <div className="bg-white p-8 rounded-[40px] border-2 border-purple-500 shadow-xl shadow-purple-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                        Plano Pro
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Acesso Ilimitado</p>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-black text-gray-800">R$ 19</span>
                        <span className="text-lg font-bold text-gray-400">,90/mês</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                            <span className="text-green-500 text-lg font-black">✓</span> Pets Ilimitados
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                            <span className="text-green-500 text-lg font-black">✓</span> Todas as Funções Liberadas
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                            <span className="text-green-500 text-lg font-black">✓</span> Histórico Sem Limites
                        </li>
                        <li className="flex items-center gap-3 text-sm font-bold text-gray-600">
                            <span className="text-green-500 text-lg font-black">✓</span> Suporte Prioritário
                        </li>
                    </ul>

                    <button
                        disabled={!!loading}
                        onClick={handleSubscribe}
                        className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg hover:shadow-purple-200 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Redirecionando...' : 'ASSINAR E COMEÇAR TESTE'}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-4 font-bold uppercase">
                        Acesso imediato após o pagamento
                    </p>
                </div>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center max-w-[200px] leading-relaxed">
                Pagamento seguro via Cakto. Cancele quando quiser.
            </p>
        </div>
    );
};

export default Subscription;
