# Rumli (Office Spotter)

System rezerwacji sal/spotów biurowych: **Django (API)** + **React (UI)**.

## Funkcje

- Przeglądanie sal (`Room`)
- Sprawdzanie dostępności w przedziale czasu
- Dodawanie rezerwacji (`Reservation`) z blokadą nakładania się terminów
- Usuwanie **własnych** rezerwacji
- Proste logowanie tokenem (`/api/auth/login/`)

## Uruchomienie (dev)

### Backend (Django)

```bash
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python backend\manage.py migrate
.\.venv\Scripts\python backend\manage.py createsuperuser
.\.venv\Scripts\python backend\manage.py runserver
```

Panel admina: `http://127.0.0.1:8000/admin/`

Dodaj kilka sal w adminie (Rooms), żeby UI miało co wyświetlać.

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

UI: `http://127.0.0.1:5173/`

Frontend korzysta z proxy Vite do backendu (`/api` → `http://127.0.0.1:8000`).

## Testy

```bash
.\.venv\Scripts\python backend\manage.py test booking
```

Testy obejmują m.in. próbę podwójnej rezerwacji tej samej sali w tym samym czasie.

## Endpointy (skrót)

- `POST /api/auth/login/` → `{ token }`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `GET /api/rooms/`
- `GET /api/rooms/availability/?start=<iso>&end=<iso>`
- `GET /api/reservations/mine/`
- `POST /api/reservations/`
- `DELETE /api/reservations/<id>/`

