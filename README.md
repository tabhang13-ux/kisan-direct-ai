# KisanDirect AI

> **"From Farm to Buyer — Fairer, Faster, Smarter."**

A complete, production-quality full-stack AgriTech web application developed for **Smart India Hackathon (SIH 2026)** problem statement **26033**.

---

## 🏛️ Problem Statement Context

* **ID:** 26033
* **Title:** Multiple intermediaries reduce farmers earnings and increase consumer prices.
* **Organization:** Ministry of Consumer Affairs, Food & Public Distribution
* **Department:** Department of Consumer Affairs (DoCA)
* **Category:** Software
* **Theme:** Agriculture, FoodTech & Rural Development

---

## 💡 Core Solution Architecture

KisanDirect AI connects farmers and Farmers Producer Organizations (FPOs) directly with bulk buyers and retail markets, bypassing up to 4 middleman layers to deliver higher farmer payouts and lower consumer prices.

```
PREDICT ──► MATCH ──► AGGREGATE ──► OPTIMIZE ──► DELIVER
```

1. **PREDICT:** Python FastAPI `scikit-learn` RandomForest model predicts regional crop demand and recommends fair listing prices with explainable AI drivers.
2. **MATCH:** Multi-factor weighted matching algorithm (Price 35%, Distance 25%, Quantity 20%, Delivery 10%, Reliability 10%) ranks top suppliers.
3. **AGGREGATE:** Combines small lot supplies across multiple smallholder farmers/FPOs to satisfy large 1,000+ kg bulk buyer orders.
4. **OPTIMIZE:** Google OR-Tools (with Nearest Neighbor CVRP fallback) minimizes pickup-and-delivery distance, saving ~35+ km per route.
5. **DELIVER:** Real-time logistics tracking via OpenStreetMap & Leaflet.

---

## 🚀 Technology Stack

* **Frontend:** React 18, Vite, Tailwind CSS, Recharts, Leaflet & React-Leaflet, Lucide Icons, Axios, React Router v6.
* **Backend:** Node.js, Express.js REST APIs, JWT Authentication, bcryptjs, Prisma ORM.
* **Database:** SQLite (default for instant portable execution) / PostgreSQL support via Prisma.
* **AI/ML Service:** Python 3.12, FastAPI, scikit-learn, numpy, pandas, joblib.
* **Route Optimization:** Python Google OR-Tools (Capacitated Vehicle Routing Problem - CVRP).

---

## 🔑 Demo Credentials (Password: `password123`)

| Role | Email | Name / Entity |
| :--- | :--- | :--- |
| **Farmer** | `farmer@demo.com` | Ramesh Kulkarni (Manchar Village) |
| **FPO Manager** | `fpo@demo.com` | Pune Sahakari Krishi Producer Co. |
| **Bulk Buyer** | `buyer@demo.com` | FreshBasket Supermarkets India |
| **Logistics** | `logistics@demo.com` | KisanDirect Express Fleet |
| **Admin (DoCA)** | `admin@demo.com` | Dr. Rajesh Sharma (DoCA Officer) |

---

## 🛠️ Step-by-Step Installation & Setup

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install Python ML dependencies
cd ../ml-service && pip install -r requirements.txt
```

### 2. Database Migration & Realistic Seeding
```bash
# Push Prisma schema and seed 20+ farmers, 3 FPOs, 10+ buyers around Pune
cd backend
npx prisma db push --schema=../prisma/schema.prisma
node ../prisma/seed.js
```

### 3. Train ML Models
```bash
# Train crop demand & price recommendation models
python ml-service/app/train.py
```

### 4. Run Services
```bash
# Terminal 1: Run Python FastAPI ML Service (Port 8000)
python -m uvicorn ml-service.app.main:app --port 8000 --reload

# Terminal 2: Run Express Backend REST Server (Port 5000)
cd backend && npm run dev

# Terminal 3: Run Vite React Frontend (Port 3000)
cd frontend && npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## ✨ SIH Presentation Mode ("Launch Demo Scenario")

Click the **"Launch Demo Scenario"** button in the top navigation bar to execute an automated 8-step live walkthrough for hackathon judges in 2–3 minutes:

1. Farmer lists 2,000 kg Tomato in Manchar.
2. AI ML service predicts HIGH demand (18,400 kg) in Pune.
3. System recommends ₹24/kg listing price with explainability.
4. Buyer posts 1,500 kg requirement at max ₹27/kg.
5. Smart Matching engine selects FPO + 3 farmers and aggregates supply.
6. OR-Tools route optimization calculates 4-pickup route saving 51 km and ₹570 transport cost.
7. Order #ORD-26033 confirmed and fleet vehicle assigned.
8. Real-time Impact: Farmer payout increases +50% (₹27 vs ₹18/kg traditional mandi).

---

## 📡 Main REST API Endpoints

* `POST /api/auth/register` - User registration with role selection.
* `POST /api/auth/login` - User login returning JWT token.
* `GET /api/marketplace` - Search & filter produce catalog.
* `POST /api/farmers/produce` - Add new farm produce listing.
* `POST /api/fpo/aggregate` - Aggregate multi-farmer supplies.
* `POST /api/buyers/requirements` - Post requirement & trigger supplier matching.
* `POST /api/matching/find` - Run 5-factor weighted supplier matching algorithm.
* `POST /api/routes/optimize` - Execute OR-Tools CVRP route optimization.
* `POST /api/forecast/demand` - Get scikit-learn demand forecast.
* `POST /api/forecast/price` - Get AI price recommendation.
* `GET /api/analytics/dashboard` - DoCA Government analytics metrics & charts.
* `POST /api/demo/scenario` - Trigger SIH 2-minute demo scenario.

---

## 🏛️ Honesty & Simulation Transparency

All statistics displayed on the prototype dashboard are clearly marked:
**"PROTOTYPE SIMULATION DATA — SIH DEMO 2026"** to distinguish demo simulation metrics from live deployment data.
