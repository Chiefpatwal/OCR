
# OCR Web App

This project has two parts:

* **Backend** → Python (Flask)
* **Frontend** → React (Vite)

Run both in **separate terminals**.

---

## Project Structure

```
backend/
frontend/
```

---

## Backend (Flask)

```bash
cd backend
python3.11 -m venv venv     # first time only
source venv/bin/activate
pip install -r requirements.txt
python app.py               # or: flask run
```

Backend runs at:

```
http://xxx.xx.xx.xx
```

---

## Frontend (React)

```bash
cd frontend
npm install        # first time only
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Notes

* Use **Python 3.11**
* Activate `venv` before running backend
* Backend must be running for frontend API calls
* Use two terminals

---

## Quick Start

```bash
# Terminal 1
cd backend && source venv/bin/activate && python app.py

# Terminal 2
cd frontend && npm run dev
```

---


