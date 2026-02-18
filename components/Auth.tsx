
import React, { useState } from 'react';
import { User } from '../types';
import { ZorgoLogo } from '../constants';
import { supabase } from '../services/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        if (signUpError) throw signUpError;
      } else if (mode === 'login') {
        // Logando com timeout de segurança
        const loginPromise = supabase.auth.signInWithPassword({ email, password });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("O servidor demorou muito para responder. Tente novamente.")), 15000)
        );

        const result = await Promise.race([loginPromise, timeoutPromise]) as any;
        if (result.error) throw result.error;
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação');
    } finally {
      // Pequeno delay no reset do loading para garantir que o estado do App mude primeiro
      setTimeout(() => setLoading(false), 1000);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 gradient-bg">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl slide-in">
        <ZorgoLogo />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">PetZorgo</h1>
          <p className="text-gray-500 mt-2">Organize a rotina do seu pet</p>
          {mode === 'register' && (
            <div className="mt-4 bg-purple-50 text-purple-600 py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
              🎁 GANHE 7 DIAS DE TESTE GRÁTIS
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm border border-green-100">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
              disabled={loading}
            />
          </div>
          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs text-purple-600 hover:underline">Esqueceu a senha?</button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                disabled={loading}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl gradient-bg text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
          >
            {loading ? 'Carregando...' : (mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar Conta' : 'Enviar E-mail')}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">
          {mode === 'login' ? (
            <>Não tem conta? <button onClick={() => setMode('register')} className="text-purple-600 font-bold hover:underline">Cadastre-se</button></>
          ) : mode === 'register' ? (
            <>Já tem conta? <button onClick={() => setMode('login')} className="text-purple-600 font-bold hover:underline">Entrar</button></>
          ) : (
            <button onClick={() => setMode('login')} className="text-purple-600 font-bold hover:underline">Voltar para Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
