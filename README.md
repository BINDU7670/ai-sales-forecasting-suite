# AI Sales Forecasting Suite

Welcome to the AI Sales Forecasting Suite! This project consists of a FastAPI backend and a Next.js frontend designed to provide sales forecasting and analytics.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python](https://www.python.org/) (v3.8 or higher)
- Git

---

## 🛠️ Backend Setup (FastAPI)

The backend powers the database, authentication, uploads, and AI analytics.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   - Copy the `.env.example` file and rename it to `.env`:
     - **Windows:** `copy .env.example .env`
     - **Mac/Linux:** `cp .env.example .env`
   - Open the `.env` file and fill in your actual API keys (Groq, Resend, FRED, etc.).

6. **Run the backend development server:**
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will now be running at `http://127.0.0.1:8000`*

---

## 💻 Frontend Setup (Next.js)

The frontend is a React application built with Next.js, providing the user interface and dashboard.

1. **Navigate to the frontend directory:**
   *(Open a new terminal window to keep the backend running)*
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the `.env.example` file and rename it to `.env`:
     - **Windows:** `copy .env.example .env`
     - **Mac/Linux:** `cp .env.example .env`
   - Open the `.env` file and verify `NEXT_PUBLIC_BACKEND_URL` is pointing to the correct backend address (default: `http://127.0.0.1:8000`).

4. **Run the frontend development server:**
   ```bash
   npm run dev
   ```
   *The frontend will now be accessible at `http://localhost:3000`*

---

## 🚀 Running the Full Stack

To run the application, you will typically need two terminal windows open:
1. One running the **backend** virtual environment (`uvicorn main:app --reload`).
2. One running the **frontend** Node server (`npm run dev`).

You can now open your browser to `http://localhost:3000` and start using the AI Sales Forecasting Suite!
