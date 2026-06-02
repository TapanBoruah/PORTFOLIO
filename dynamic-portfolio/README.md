# Dynamic MERN Stack Portfolio 🚀

A highly responsive, dynamic, and visually stunning MERN stack portfolio designed specifically for **Tapan Boruah** (Mechanical Engineer & MERN Stack Developer). This application features a premium engineering-themed aesthetic, dynamic skills category filters, a dual Education/Achievements timeline, and a fully functional and secure administrative control panel.

---

## 🛠️ Tech Stack & Key Features
- **Frontend**: React.js (Vite configuration) with premium styling via Tailwind CSS. Beautiful mesh glow points, interactive blueprint grid backgrounds, and responsive mobile overlay menus.
- **Backend**: Node.js & Express.js server, utilizing standard RESTful APIs for managing portfolio content dynamically.
- **Database**: MongoDB (via Mongoose schemas) storing your information and visitor inquiries securely.
- **Security**: Administrator authorization utilizing hashed passwords (bcryptjs) and secure JSON Web Tokens (JWT) for dashboard operations.
- **Admin Control Dashboard**: A highly polished HUD control center located under `/admin` that supports complete **CRUD** operations:
  - **Metrics Board**: Real-time stats summaries of database contents.
  - **Skills Editor**: Live skill addition forms, category sorting, and proficiency slider adjustments.
  - **Projects Manager**: Direct form inputs to compile cover photos, source codes, tag grids, and deployment hosts.
  - **Timeline Editor**: Combined visual chronology boards to manage academic courses, CGPAs, and percussion/ tabla award descriptions.
  - **Inquiries Inbox**: View and remove client contact inquiries dynamically.

---

## 📂 Directory Layout
```
dynamic-portfolio/
├── package.json                 # Monorepo concurrency script configuration
├── README.md                    # Instructions & configuration reference
├── backend/                     # Node.js + Express API server
│   ├── models/                  # Mongoose Database Schemas
│   ├── routes/                  # API endpoints (auth, skills, projects, timeline, messages)
│   ├── middleware/              # JWT authorization filter
│   ├── .env                     # Configuration keys (secrets, ports, MongoDB URI)
│   ├── server.js                # Express Server startup
│   └── seeder.js                # Existing data seeding script
└── frontend/                    # Vite + React Client application
    ├── public/                  # Assets (includes your portfolio photos)
    ├── src/                     # React components, contexts, and hooks
    ├── vite.config.js           # Dev server and proxy bindings
    └── tailwind.config.js       # Design tokens & animation keys
```

---

## ⚙️ Quick Installation & Setup

### 1. Configure Environment Settings
Create or open the `.env` file under `backend/.env` to configure your connection strings:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=TapanBoruahPortfolioSuperSecretKey2026!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```
*Note: If you have a MongoDB Atlas connection string, simply paste it in `MONGO_URI`.*

### 2. Populate/Seed the Database
From the `dynamic-portfolio` root directory, execute the database loader. This clears any blank listings, registers your admin credentials (`admin` / `admin123`), and imports all skills, timeline achievements, and projects matching your original `index.html` file!
```bash
npm run seed
```

---

## 🚀 Running the Application

To execute both backend APIs and the frontend Vite server concurrently in development mode, run this single command from the root directory:
```bash
npm run dev
```

The application will launch on:
- **Frontend client**: `http://localhost:5173/`
- **Backend API**: `http://localhost:5000/`

---

## 🔒 Securing the Admin Dashboard
1. Open your browser and navigate to `http://localhost:5173/admin` or click the **Admin Portal** button in the header.
2. Log in using your seeded credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. After logging in, you will be taken to your dashboard control center, where you can modify your portfolio, view metrics, and read contact letters.
