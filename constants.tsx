
import React from 'react';

export const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  taskColors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
};

export const ZorgoLogo: React.FC<{ size?: string }> = ({ size = "w-28 h-28" }) => (
  <div className={`${size} mx-auto mb-4 flex items-center justify-center logo-spin`}>
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <circle cx="100" cy="100" r="95" fill="url(#gradientBg)" stroke="#667eea" strokeWidth="3" />
      <defs>
        <linearGradient id="gradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradientPaw" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="110" rx="22" ry="28" fill="url(#gradientPaw)" />
      <ellipse cx="70" cy="65" rx="14" ry="20" fill="url(#gradientPaw)" />
      <ellipse cx="130" cy="65" rx="14" ry="20" fill="url(#gradientPaw)" />
      <ellipse cx="65" cy="145" rx="14" ry="20" fill="url(#gradientPaw)" />
      <ellipse cx="135" cy="145" rx="14" ry="20" fill="url(#gradientPaw)" />
      <g transform="translate(100, 40)">
        <polygon points="0,-12 3,-3 12,-3 5,3 8,12 0,6 -8,12 -5,3 -12,-3 -3,-3" fill="#FFD700" opacity="0.9" />
      </g>
      <text x="100" y="175" fontFamily="Nunito" fontSize="24" fontWeight="bold" textAnchor="middle" fill="white" letterSpacing="2">ZORGO</text>
    </svg>
  </div>
);

export const ROUTINE_TEMPLATES = [
  { name: 'Alimentação 🍖', frequency: 'daily', color: '#10B981' },
  { name: 'Água Fresca 💧', frequency: 'daily', color: '#3B82F6' },
  { name: 'Passeio 🐕', frequency: 'daily', color: '#F59E0B' },
  { name: 'Banho 🛁', frequency: 'weekly', color: '#8B5CF6' },
  { name: 'Remédio 💊', frequency: 'custom', color: '#EF4444' },
  { name: 'Escovar Pelo 🪮', frequency: 'weekly', color: '#EC4899' }
];
