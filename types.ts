
export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  FISH = 'fish',
  OTHER = 'other'
}

export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom'
}

export interface WeightEntry {
  id: string;
  weight: number;
  unit: string;
  date: string;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  size?: 'small' | 'medium' | 'large';
  birthday?: string;
  currentWeight?: number;
  weightUnit?: string;
  gender?: 'male' | 'female';
  coatType?: string;
  weightHistory: WeightEntry[];
  createdAt: string;
}

export interface Task {
  id: string;
  petId: string;
  name: string;
  frequency: Frequency;
  frequencyDays: number;
  nextDate: string;
  time?: string; // HH:MM format, optional
  lastCompleted?: string;
  color: string;
  completed: boolean;
}

export interface Event {
  id: string;
  petId: string;
  name: string;
  date: string;
  location?: string;
  description?: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  brand?: string;
  date: string;
  veterinarian?: string;
  clinic?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'canceled';
  subscriptionEndDate?: string;
}

export type View = 'dashboard' | 'pets' | 'calendar' | 'events' | 'history' | 'settings' | 'vaccines' | 'admin' | 'subscription';
