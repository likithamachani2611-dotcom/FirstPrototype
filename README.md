# Findora — Smart Lost-and-Found Network

Findora is an intelligent lost-and-found community platform built for colleges, transit hubs, malls, and public spaces. It compares lost-item reports with found-item reports and suggests matches using item descriptions, categories, colors, locations, dates, and other attributes — with double-blind ownership proof to prevent false claims.

---

## Features

- **Explainable 10-Signal Matching Engine**: Mathematical attribute evaluation (Category 15%, Title 15%, Description 20%, Color 10%, Brand/Model 10%, Distinctive Marks 15%, Date Proximity 5%, Geographic Proximity 10%) with natural-language rationale output.
- **Double-Blind Anti-Fraud & Concealed Attributes**: Finders can record secret distinguishing features concealed from the public directory so only legitimate claimants can verify them.
- **7-Stage Ownership Verification**: `Submitted` &rarr; `Under Review` &rarr; `Info Requested` &rarr; `Approved` &rarr; `Rejected` &rarr; `Returned / Completed` &rarr; `Withdrawn`.
- **Interactive OpenStreetMap (Leaflet)**: Map view with custom markers for lost and found items, coordinate geolocation, and discovery spot pinning.
- **Network Analytics (Recharts)**: Recovery rate, category distribution, and community statistics.
- **Private In-App Messaging**: Secure coordination channel between claimant and finder without revealing personal phone numbers or email addresses.
- **PostgreSQL & Supabase Architecture**: Complete `supabase-schema.sql` with Row Level Security (RLS) policies, storage buckets, and seamless local fallback.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router 7.
- **Visuals & Charts**: Recharts, Leaflet, Canvas Confetti.
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage, RLS) with instant local high-speed fallback.

---

## Quick Start (Running Locally)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Git Setup & Push Instructions

### Step 1: Install Git (If not already installed)
Download and install Git from [git-scm.com/download/win](https://git-scm.com/download/win), or run in PowerShell:
```powershell
winget install --id Git.Git -e --source winget
```
*(After installing, restart your terminal or IDE to refresh your PATH)*

### Step 2: Initialize & Commit
In the project root (`c:\Users\sreen\OneDrive\Project`):
```bash
git init
git add .
git commit -m "Initial commit: Findora Smart Lost-and-Found Network"
```

### Step 3: Link Remote & Push
Create an empty repository on GitHub/GitLab, then run:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repository-name>.git
git push -u origin main
```
