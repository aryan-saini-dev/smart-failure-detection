# Smart Failure Detection

An intelligent, AI-powered workspace for startup failure prediction, competitor analysis, risk scoring, and market insights. By combining the predictive power of custom Machine Learning models with the analytical reasoning of Large Language Models, this platform acts as an automated venture capital analyst for early-stage founders.

---

## 📖 Overview

**Smart Failure Detection** is a full-stack web application designed to help entrepreneurs, investors, and product teams quantitatively and qualitatively evaluate the viability of a startup idea. Users input their business model, target market, budget, and industry, and the platform generates a comprehensive risk report.

The system uses a two-pronged AI approach:
1. **Gemini AI**: Conducts real-time market research, identifies competitors, generates financial projections, and structures unstructured startup descriptions into structured ML features.
2. **Local ML Pipeline**: Runs an XGBoost classification model trained on a historical dataset of startup successes and failures to compute a precise probability of failure based on funding and sector metrics.

All analyses are securely saved to the cloud using Supabase, allowing users to revisit, track, and duplicate their project assessments over time.

---

## 🛑 Problem Statement

It is a well-known statistic that **over 90% of startups fail**. The root causes are often preventable: misjudging market demand, flawed unit economics, fierce competition, or inadequate funding runway. 

However, founders often operate in an echo chamber and lack accessible, unbiased, and data-driven tools to assess their risk *before* committing significant capital and years of their lives. Traditional market research is expensive and time-consuming, while generic AI chatbots lack the structured, quantitative rigor required for robust business validation.

---

## 💡 Proposed Solution & Architecture

We built a holistic evaluation platform that democratizes venture-grade due diligence. 

### Core Features
- **Instant Market Analysis**: AI-generated competitor landscapes highlighting strengths, weaknesses, and market overlap.
- **Dynamic Risk Scoring**: A composite risk score (0-100) blending ML historical probability with AI-driven market sentiment.
- **Financial Projections**: 6-month predictive revenue and cost modeling based on the provided budget and industry benchmarks.
- **History & Versioning**: Secure authentication and project saving via Supabase allows for iterative scenario testing (e.g., "What if I pivot to a subscription model?").

### Architecture Stack
- **Frontend**: React 19, TanStack Router, Tailwind CSS, Recharts, Radix UI.
- **Backend API**: Node.js custom HTTP server to proxy secure requests and manage child processes.
- **Machine Learning Engine**: Python, XGBoost, Pandas. The model (`server/ml/predict.py`) executes locally via a Node `child_process`.
- **Database & Authentication**: Supabase (managed PostgreSQL cloud) with Row-Level Security (RLS).
- **Generative AI**: Google Gemini 2.5 Flash API.

---

## 🚀 How to Run Locally

Follow these instructions to get the full stack (Frontend, Node API, and Python ML Model) running on your local machine.

### 📋 Prerequisites
1. **Node.js** (v18 or higher)
2. **Python** (v3.9 or higher)
3. **Supabase Account** (Free tier)
4. **Google Gemini API Key** (Free tier)

### Step 1: Clone & Install Dependencies
```bash
git clone https://github.com/aryan-saini-dev/smart-failure-detection.git
cd smart-failure-detection

# Install Node dependencies
npm install
```

### Step 2: Set Up Python ML Environment
The local Node.js backend requires a Python virtual environment to execute the machine learning scripts.
```bash
cd Dataset
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install ML dependencies
pip install -r ../requirements.txt
```

### Step 3: Configure Supabase
1. Create a new project on [Supabase](https://supabase.com/).
2. Disable Email Confirmation in **Authentication -> Providers -> Email**.
3. Go to the **SQL Editor** in Supabase and run the following script to create your table and security policies:
   ```sql
   CREATE TABLE projects (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     industry TEXT NOT NULL,
     business_model TEXT NOT NULL,
     target_market TEXT NOT NULL,
     budget NUMERIC NOT NULL DEFAULT 0,
     description TEXT NOT NULL,
     analysis_data JSONB,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Users can manage their own projects" 
   ON projects FOR ALL 
   USING (auth.uid() = user_id);
   ```

### Step 4: Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Populate it with your keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
API_PORT=8787
```

### Step 5: Start the Servers
Open **two terminal windows** in the root directory.

**Terminal 1 (Backend Node.js API)**:
```bash
npm run api
```
*(Runs the backend server on `http://localhost:8787`)*

**Terminal 2 (Frontend React App)**:
```bash
npm run dev
```
*(Runs the Vite dev server on `http://localhost:3000`)*

Open your browser to `http://localhost:3000` and start evaluating startups!

---

## 📁 Repository Structure
- `/src` - React frontend code, routing, and UI components.
- `/server` - Node.js API backend and the Python bridge (`/server/ml/predict.py`).
- `/Dataset` - The Jupyter notebooks, historical CSV datasets, and python virtual environment used to train the XGBoost model.
- `/public` - Static assets and fonts.
