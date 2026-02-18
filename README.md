# 🐾 PetZorgo - O Seu Parceiro na Gestão Pet SaaS

<div align="center">
  <img width="1200" height="auto" alt="PetZorgo Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  **Transforme a rotina do seu pet em uma experiência organizada, profissional e lucrativa.**
  
  [![Vercel](https://img.shields.io/badge/Hosted-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
</div>

---

## 🚀 Sobre o Projeto

O **PetZorgo** é uma plataforma SaaS (Software as a Service) desenvolvida para donos de pets que não abrem mão da organização. Mais do que um simples rastreador, é um ecossistema completo para gerenciar a saúde, rotina e bem-estar de cães, gatos e outros animais de estimação, com um modelo de negócio pronto para escala.

## ✨ Funcionalidades Principais

### 🐕 Experiência do Usuário (Cliente)
- **Dashboard Gamerified:** Visão geral de tarefas do dia, status de saúde e estatísticas rápidas.
- **Gestão de Rotinas:** Configure lembretes para alimentação, passeios, banhos e medicamentos com frequências customizáveis.
- **Prontuário de Vacinação:** Histórico completo de vacinas aplicadas, marcas e datas de reforço.
- **Controle de Peso:** Acompanhamento gráfico da evolução do peso do pet ao longo do tempo.
- **Agenda Inteligente:** Calendário visual com todos os eventos e compromissos do pet.
- **Exportação de Dados:** Geração de relatórios em PDF para acompanhamento veterinário.

### 👑 Painel Administrativo (Dono do SaaS)
- **Métricas de Crescimento:** Acompanhe o total de usuários e pets cadastrados em tempo real.
- **Gestão de Assinantes:** Liste e gerencie o status de acesso de cada cliente.
- **Trial Automático:** Sistema nativo que concede **7 dias de acesso grátis** para novos cadastros.

## 🛠️ Stack Tecnológica

O projeto utiliza as ferramentas mais modernas do mercado para garantir performance e segurança:

- **Frontend:** React + Vite (Fast Refresh e Build otimizado).
- **Estilização:** Tailwind CSS (Interface Apple-like responsiva).
- **Backend/DB:** Supabase (Auth, PostgreSQL, Real-time e RLS).
- **Automação SaaS:** n8n (Integração de Webhooks de pagamento).
- **Pagamentos:** Cakto (Checkout recorrente integrado).

## 🔒 Segurança e Privacidade

- **RLS (Row Level Security):** Seus dados são trancados no nível do banco de dados. Um usuário nunca consegue ver os dados de outro.
- **Sanitização:** Funções de banco de dados protegidas contra injeção e acessos indevidos.
- **Isolamento SaaS:** Gestão de planos feita via servidor, impedindo burlas no front-end.

## ⚙️ Configuração para Desenvolvimento

Siga os passos abaixo para rodar o projeto localmente:

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/vinicioassisdev/petzorgo.git
   cd petzorgo
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz e adicione suas chaves do Supabase:
   ```env
   VITE_SUPABASE_URL=seu_link_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon
   ```

4. **Rodar:**
   ```bash
   npm run dev
   ```

## 🌐 Deploy na Vercel

O projeto está pronto para a Vercel. Ao conectar seu GitHub:
1. O Framework Preset será detectado como **Vite**.
2. Adicione as chaves acima em **Project Settings > Environment Variables**.
3. O roteamento de SPA já está configurado via `vercel.json`.

---

<div align="center">
  <p>Desenvolvido com ❤️ para apaixonados por pets.</p>
  <strong>De Assis Dev 🌌</strong>
</div>
