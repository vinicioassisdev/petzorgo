
import { supabase } from './supabase';
import { Pet, Task, Event, Vaccine } from '../types';

// Helper to map DB pet to App pet
const mapPet = (dbPet: any): Pet => ({
    id: dbPet.id,
    name: dbPet.name,
    type: dbPet.type,
    breed: dbPet.breed,
    size: dbPet.size,
    birthday: dbPet.birthday,
    currentWeight: dbPet.current_weight,
    weightUnit: dbPet.weight_unit,
    gender: dbPet.gender,
    coatType: dbPet.coat_type,
    weightHistory: (dbPet.weight_history || []).map((w: any) => ({
        id: w.id,
        weight: w.weight,
        unit: w.unit,
        date: w.date
    })),
    createdAt: dbPet.created_at
});

// Helper to map DB task to App task
const mapTask = (dbTask: any): Task => ({
    id: dbTask.id,
    petId: dbTask.pet_id,
    name: dbTask.name,
    frequency: dbTask.frequency,
    frequencyDays: dbTask.frequency_days,
    nextDate: dbTask.next_date,
    time: dbTask.time || undefined,
    lastCompleted: dbTask.last_completed,
    color: dbTask.color,
    completed: dbTask.completed
});

// Helper to map DB event to App event
const mapEvent = (dbEvent: any): Event => ({
    id: dbEvent.id,
    petId: dbEvent.pet_id,
    name: dbEvent.name,
    date: dbEvent.date,
    location: dbEvent.location,
    description: dbEvent.description
});

// Helper to map DB vaccine to App vaccine
const mapVaccine = (dbVaccine: any): Vaccine => ({
    id: dbVaccine.id,
    petId: dbVaccine.pet_id,
    name: dbVaccine.name,
    brand: dbVaccine.brand,
    date: dbVaccine.date,
    veterinarian: dbVaccine.veterinarian,
    clinic: dbVaccine.clinic
});

export const petService = {
    async getPets(): Promise<Pet[]> {
        const { data, error } = await supabase
            .from('pets')
            .select('*, weight_history(*)');
        if (error) throw error;
        return (data || []).map(mapPet);
    },

    async addPet(pet: Omit<Pet, 'id' | 'createdAt' | 'weightHistory'>): Promise<Pet> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('pets')
            .insert([{
                user_id: user.id,
                name: pet.name,
                type: pet.type,
                breed: pet.breed,
                size: pet.size,
                birthday: pet.birthday,
                current_weight: pet.currentWeight,
                weight_unit: pet.weightUnit,
                gender: pet.gender,
                coat_type: pet.coatType
            }])
            .select('*, weight_history(*)')
            .single();
        if (error) throw error;
        return mapPet(data);
    },

    async updatePet(id: string, updates: Partial<Pet>): Promise<Pet> {
        const { data, error } = await supabase
            .from('pets')
            .update({
                name: updates.name,
                type: updates.type,
                breed: updates.breed,
                size: updates.size,
                current_weight: updates.currentWeight,
                weight_unit: updates.weightUnit,
                gender: updates.gender,
                coat_type: updates.coatType
            })
            .eq('id', id)
            .select('*, weight_history(*)')
            .single();
        if (error) throw error;
        return mapPet(data);
    },

    async deletePet(id: string) {
        const { error } = await supabase
            .from('pets')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};

export const taskService = {
    async getTasks(): Promise<Task[]> {
        const { data, error } = await supabase
            .from('tasks')
            .select('*');
        if (error) throw error;
        return (data || []).map(mapTask);
    },

    async addTask(task: Omit<Task, 'id'>): Promise<Task> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                user_id: user.id,
                pet_id: task.petId,
                name: task.name,
                frequency: task.frequency,
                frequency_days: task.frequencyDays,
                next_date: task.nextDate,
                time: task.time || null,
                color: task.color,
                completed: task.completed
            }])
            .select()
            .single();
        if (error) throw error;
        return mapTask(data);
    },

    async completeTask(id: string, nextDate: string): Promise<Task> {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                next_date: nextDate,
                last_completed: new Date().toISOString(),
                completed: false // Reset completed status for next occurrence if needed
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return mapTask(data);
    },

    async deleteTask(id: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};

export const eventService = {
    async getEvents(): Promise<Event[]> {
        const { data, error } = await supabase
            .from('events')
            .select('*');
        if (error) throw error;
        return (data || []).map(mapEvent);
    },

    async addEvent(event: Omit<Event, 'id'>): Promise<Event> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('events')
            .insert([{
                user_id: user.id,
                pet_id: event.petId,
                name: event.name,
                date: event.date,
                location: event.location,
                description: event.description
            }])
            .select()
            .single();
        if (error) throw error;
        return mapEvent(data);
    },

    async deleteEvent(id: string) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};

export const vaccineService = {
    async getVaccines(): Promise<Vaccine[]> {
        const { data, error } = await supabase
            .from('vaccines')
            .select('*');
        if (error) throw error;
        return (data || []).map(mapVaccine);
    },

    async addVaccine(vaccine: Omit<Vaccine, 'id'>): Promise<Vaccine> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('vaccines')
            .insert([{
                user_id: user.id,
                pet_id: vaccine.petId,
                name: vaccine.name,
                brand: vaccine.brand,
                date: vaccine.date,
                veterinarian: vaccine.veterinarian,
                clinic: vaccine.clinic
            }])
            .select()
            .single();
        if (error) throw error;
        return mapVaccine(data);
    },

    async deleteVaccine(id: string) {
        const { error } = await supabase
            .from('vaccines')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};

export const reportService = {
    async getReportData(startDate: string, endDate: string, petId?: string) {
        let petQuery = supabase.from('pets').select('*, weight_history(*)');
        if (petId) petQuery = petQuery.eq('id', petId);
        const { data: pets } = await petQuery;

        let tasksQuery = supabase.from('tasks').select('*').gte('created_at', startDate).lte('created_at', endDate);
        if (petId) tasksQuery = tasksQuery.eq('pet_id', petId);
        const { data: tasks } = await tasksQuery;

        let eventsQuery = supabase.from('events').select('*').gte('date', startDate).lte('date', endDate);
        if (petId) eventsQuery = eventsQuery.eq('pet_id', petId);
        const { data: events } = await eventsQuery;

        let vaccinesQuery = supabase.from('vaccines').select('*').gte('date', startDate).lte('date', endDate);
        if (petId) vaccinesQuery = vaccinesQuery.eq('pet_id', petId);
        const { data: vaccines } = await vaccinesQuery;

        return {
            pets: (pets || []).map(mapPet),
            tasks: (tasks || []).map(mapTask),
            events: (events || []).map(mapEvent),
            vaccines: (vaccines || []).map(mapVaccine)
        };
    },

    async deleteOldData() {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateStr = oneYearAgo.toISOString();

        // Delete old tasks, events and vaccines
        const { error: taskError } = await supabase.from('tasks').delete().lt('created_at', dateStr);
        const { error: eventError } = await supabase.from('events').delete().lt('date', dateStr);
        const { error: vaccineError } = await supabase.from('vaccines').delete().lt('date', dateStr);

        if (taskError || eventError || vaccineError) throw new Error('Falha ao limpar dados antigos');
    }
};

export const adminService = {
    async getStats() {
        // These queries will only work if the user is an admin in public.profiles and RLS allows it
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: petsCount } = await supabase.from('pets').select('*', { count: 'exact', head: true });
        const { count: tasksCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });
        const { count: vaccinesCount } = await supabase.from('vaccines').select('*', { count: 'exact', head: true });

        // Growth data (last 30 days)
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        const lastMonthStr = lastMonth.toISOString();

        const { count: newUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStr);
        const { count: newPets } = await supabase.from('pets').select('*', { count: 'exact', head: true }).gte('created_at', lastMonthStr);

        return {
            totalUsers: usersCount || 0,
            totalPets: petsCount || 0,
            totalTasks: tasksCount || 0,
            totalVaccines: vaccinesCount || 0,
            growth: {
                newUsers: newUsers || 0,
                newPets: newPets || 0
            }
        };
    },

    async getUserProfile(id: string) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async getSubscribers() {
        const { data, error } = await supabase
            .from('gestao_assinaturas')
            .select('*')
            .order('ACESSO_ATE', { ascending: false });
        if (error) throw error;
        return data;
    }
};
