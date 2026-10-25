# HeraHealth — Women’s Healthcare MVP

HeraHealth helps users keep a symptom journal, view descriptive summaries of their own records, compare reported daily-life impact across two 7-day windows, and prepare a printable visit summary. It does not diagnose or replace professional medical care. Use fictional data for hackathon demos.

## Features in this build
- Account registration/sign-in with Werkzeug password hashing and session-based access to a user's own entries.
- Optional profile details and user-authored questions for a clinician.
- Symptom create/read/update/delete with date/symptom filtering and input validation.
- Insights calculated from actual records, including severity trend and descriptive impact comparison.
- Printable visit summary with date filtering and custom questions.
- Health guidance with links to WHO, NHS and MedlinePlus; check source pages for latest updates.
- Optional note organiser. Without `GEMINI_API_KEY`, a local fallback only cleans whitespace. If configured, Gemini is used to rewrite notes neutrally; users should review output. No diagnosis is requested.
- Theme preference is stored in the browser.

## Run locally
1. Use Python 3.11 or newer.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the app: `python app.py`
4. Open `http://127.0.0.1:5000`.

## Render deployment
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn app:app`
- Set `SECRET_KEY` to a long random value in Render Environment.
- For production-like HTTPS cookies, set `COOKIE_SECURE=1` once HTTPS is active.
- To use optional Gemini note rewriting, add `GEMINI_API_KEY` as a secret environment variable. The app still works without it.
- **Persistence:** the app reads `DATABASE_PATH`. For a Render Web Service with a persistent disk attached, mount the disk at `/var/data` and set `DATABASE_PATH=/var/data/herahealth.db`. Check current Render plan/availability and disk pricing before choosing this. A standard ephemeral filesystem can lose SQLite data after restart/redeploy. Do not put the database file in GitHub.

## Important limitations
This is a hackathon prototype, not a production healthcare system. It has not undergone security, privacy, accessibility, or clinical validation audits. Do not store real sensitive health data. Before any real-world use, add CSRF protection, password reset and email verification, rate limiting, stronger session/security policies, privacy consent and deletion/export controls, audit logging, secure deployment/storage, and professional clinical review of health content. Basic account functionality is provided for MVP demonstration only.


## Added in this revision
- Personal in-app symptom tracking reminders (create, pause/activate, delete). They do not send push notifications or alarms.
- Display Settings page with browser-local theme, font-size and density preferences.
- HeraHealth Assistant page with optional Gemini-powered general education responses and a safe local fallback.
- Dashboard links and reminder summary.
- Reminder data is scoped to the signed-in account.

## Deployment notes
- Set `SECRET_KEY` to a long random value in Render environment variables.
- Set `COOKIE_SECURE=1` when serving HTTPS in production.
- For persistent SQLite on Render, attach a persistent disk and set `DATABASE_PATH` to a path on that disk. Otherwise use a managed persistent database.
- Do not use real sensitive health information in this hackathon prototype. It has not undergone a security audit.
- `GEMINI_API_KEY` is optional; never commit it to GitHub.

## Added women’s-health features
- **Cycle Tracking**: records period start/end dates, keeps per-user history, calculates intervals between recorded starts, and shows symptom journal entries on dates within the recorded period. Any interval summary is descriptive only, is shown only with enough records, and is not suitable for contraception or diagnosis.
- **Doctor Visit Preparation**: questions for the clinician and an optional medication/supplement list can be saved to the signed-in user's profile and included in the print/PDF summary.
- Existing records and reminders remain in the same SQLite database. The app includes a backwards-compatible migration for the new user field and menstrual-cycle table.


### Optional Gemini Health Assistant

The Health Assistant uses the Gemini API when `GEMINI_API_KEY` is configured. The key must be stored as a server-side environment variable (for Render, add it under the service's Environment settings). Do not place a real key in HTML, JavaScript, source control, or screenshots. If the key is missing or the API request fails, HeraHealth shows local general health-education guidance instead. The assistant is not a diagnostic tool.

### Health Calendar period markers

The Health Calendar displays saved menstrual-period dates alongside symptom entries. A recorded start/end range marks the dates entered by the user; if no end date is recorded, only the start date is marked so the calendar does not assume an unknown duration. Period records are private to the logged-in account.
