
import React, { useState, useEffect, useCallback } from 'react';
import { View, Pet, Task, Event, Vaccine, User, PetType, Frequency } from './types';
import Dashboard from './components/Dashboard';
import Pets from './components/Pets';
import Calendar from './components/Calendar';
import Events from './components/Events';
import Vaccines from './components/Vaccines';
import AdminPanel from './components/AdminPanel';
import History from './components/History';
import Settings from './components/Settings';
import Subscription from './components/Subscription';
import Auth from './components/Auth';
import Layout from './components/Layout';
import { supabase } from './services/supabase';
import { petService, taskService, eventService, vaccineService, adminService } from './services/dbService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [pets, setPets] = useState<Pet[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Monitorar Sessão (Apenas Auth brutos)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.warn("Timeout de inicialização, liberando...");
      setIsLoading(false);
    }, 5000);

    const checkSession = async () => {
      try {
        console.log("Checando sessão inicial...");
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
            email: session.user.email!
          });
        }
      } catch (e) {
        console.error("Erro ao verificar sessão:", e);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Evento Auth:", _event);
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
          email: session.user.email!
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // 2. Carregar Perfil (SaaS: Admin + Assinatura) quando o usuário logar
  useEffect(() => {
    if (user && user.id && user.subscriptionStatus === undefined) {
      const loadProfile = async () => {
        try {
          console.log("Carregando dados de assinatura...");
          const { data } = await supabase
            .from('profiles')
            .select('is_admin, subscription_status, subscription_end_date')
            .eq('id', user.id)
            .single();

          if (data) {
            setUser(prev => prev ? {
              ...prev,
              isAdmin: data.is_admin,
              subscriptionStatus: data.subscription_status,
              subscriptionEndDate: data.subscription_end_date
            } : null);
          }
        } catch (e) {
          console.error("Erro ao carregar perfil SaaS:", e);
        }
      };
      loadProfile();
    }
  }, [user]);

  // Bloqueio de Assinatura (SaaS Shield)
  const isSubscriptionExpired = user && !user.isAdmin &&
    (user.subscriptionStatus === 'expired' ||
      (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < new Date()));

  // Redirecionar para assinatura se expirado
  useEffect(() => {
    if (isSubscriptionExpired && currentView !== 'subscription') {
      setCurrentView('subscription');
    }
  }, [isSubscriptionExpired, currentView]);

  // 3. Carregar Dados (Apenas se assinatura ativa)
  useEffect(() => {
    if (user && !isSubscriptionExpired) {
      const fetchData = async () => {
        try {
          const [p, t, e, v] = await Promise.all([
            petService.getPets(),
            taskService.getTasks(),
            eventService.getEvents(),
            vaccineService.getVaccines()
          ]);
          setPets(p || []);
          setTasks(t || []);
          setEvents(e || []);
          setVaccines(v || []);
        } catch (err) {
          console.error("Erro ao carregar dados:", err);
        }
      };
      fetchData();
    }
  }, [user, isSubscriptionExpired]);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPets([]);
    setTasks([]);
    setEvents([]);
    setVaccines([]);
  };

  const addPet = async (pet: Omit<Pet, 'id' | 'createdAt' | 'weightHistory'>) => {
    try {
      const newPet = await petService.addPet(pet);
      setPets(prev => [...prev, newPet]);
    } catch (err) {
      console.error("Erro ao adicionar pet:", err);
    }
  };

  const updatePet = async (pet: Pet) => {
    try {
      const updated = await petService.updatePet(pet.id, pet);
      setPets(prev => prev.map(p => p.id === pet.id ? updated : p));
    } catch (err) {
      console.error("Erro ao atualizar pet:", err);
    }
  };

  const deletePet = async (id: string) => {
    try {
      await petService.deletePet(id);
      setPets(prev => prev.filter(p => p.id !== id));
      setTasks(prev => prev.filter(t => t.petId !== id));
      setEvents(prev => prev.filter(e => e.petId !== id));
      setVaccines(prev => prev.filter(v => v.petId !== id));
    } catch (err) {
      console.error("Erro ao excluir pet:", err);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await taskService.addTask(task);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Erro ao excluir tarefa:", err);
    }
  };

  const completeTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (task.frequencyDays || 1));
    const nextDateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;

    try {
      const updated = await taskService.completeTask(id, nextDateStr);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error("Erro ao concluir tarefa:", err);
    }
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const newEvent = await eventService.addEvent(event);
      setEvents(prev => [...prev, newEvent]);
    } catch (err) {
      console.error("Erro ao adicionar evento:", err);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
    }
  };

  const addVaccine = async (vaccine: Omit<Vaccine, 'id'>) => {
    try {
      const newVaccine = await vaccineService.addVaccine(vaccine);
      setVaccines(prev => [...prev, newVaccine]);
    } catch (err) {
      console.error("Erro ao adicionar vacina:", err);
    }
  };

  const deleteVaccine = async (id: string) => {
    try {
      await vaccineService.deleteVaccine(id);
      setVaccines(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error("Erro ao excluir vacina:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gradient-bg text-white">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-xl drop-shadow-md">Carregando PetZorgo...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} currentView={currentView} setView={setCurrentView} onLogout={handleLogout}>
      {currentView === 'dashboard' && (
        <Dashboard
          pets={pets}
          tasks={tasks}
          onCompleteTask={completeTask}
          setView={setCurrentView}
        />
      )}
      {currentView === 'pets' && (
        <Pets
          pets={pets}
          tasks={tasks}
          onAddPet={addPet}
          onUpdatePet={updatePet}
          onDeletePet={deletePet}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          onCompleteTask={completeTask}
        />
      )}
      {currentView === 'calendar' && (
        <Calendar pets={pets} tasks={tasks} events={events} />
      )}
      {currentView === 'events' && (
        <Events pets={pets} events={events} onAddEvent={addEvent} onDeleteEvent={deleteEvent} />
      )}
      {currentView === 'vaccines' && (
        <Vaccines pets={pets} vaccines={vaccines} onAddVaccine={addVaccine} onDeleteVaccine={deleteVaccine} />
      )}
      {currentView === 'history' && (
        <History pets={pets} tasks={tasks} />
      )}
      {currentView === 'settings' && (
        <Settings user={user!} pets={pets} tasks={tasks} setView={setCurrentView} />
      )}
      {currentView === 'admin' && (
        <AdminPanel />
      )}
      {currentView === 'subscription' && (
        <Subscription user={user!} />
      )}
    </Layout>
  );
};

export default App;
