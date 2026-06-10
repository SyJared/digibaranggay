# DigiBarangay — Frontend

The React frontend for DigiBarangay, a web platform that streamlines barangay services and improves community management. DigiBarangay brings local government services online — from document requests to community announcements — making it easier for residents and administrators to connect.

> 🔗 **Backend repository (PHP):** [digibaranggay-backend](https://github.com/SyJared/digibaranggay-backend)

---

## Tech Stack

- React
- React Router
- JavaScript
- CSS / Tailwind CSS
- Vite

---

## Features

- 📋 **Community Bulletin Board** — Post and view community announcements in real time
- 🔔 **Real-Time Notifications** — Residents get notified of new posts and request updates
- 📄 **Online Document Request System** — Request barangay documents without visiting in person
- 🗂️ **Community Records Management** — Admins can manage and organize resident records
- 🔐 **Role-Based Access Control** — Separate dashboards and permissions for admins and residents

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- PHP backend running locally (see [digibaranggay-backend](https://github.com/SyJared/digibaranggay-backend))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SyJared/digibaranggay
   cd digibarangay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

> Make sure the PHP backend is also running on XAMPP before starting the frontend.

---

## Project Structure

```
digibarangay/
├── src/
│   ├── USERUI/
│   ├── assets/  
│   ├── LOGIN/
│   ├── REGISTER/
│   ├── USERUI/
│   └── App.jsx
├── public/
└── README.md
```

---

## Author

**Symmon Jared Gagaring**
- GitHub: [@SyJared](https://github.com/SyJared)