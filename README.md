# HeraHealth — Women’s Healthcare MVP

**Live Demo:** [https://herahealth.onrender.com/](https://herahealth.onrender.com/)  
**GitHub Repository:** [https://github.com/KaiQian33/HeraHealth](https://github.com/KaiQian33/HeraHealth)

HeraHealth is a women’s healthcare tracking and visit-preparation web application. It helps users organise symptom records, track menstrual-cycle dates, review descriptive summaries of their own records, and prepare questions and a printable summary for a healthcare visit.

HeraHealth is **not a diagnostic tool** and does not replace professional medical care. Use fictional data for hackathon demonstrations. Do not enter real sensitive health information into this prototype.

## Key Features

- **Account registration and sign-in:** Passwords are hashed with Werkzeug, and session-based access is used for account-specific records.
- **Symptom journal:** Create, view, edit, and delete symptom entries. Filter records by date or symptom and enter severity, duration, notes, and daily-life impact.
- **Personal insights:** View descriptive severity trends and compare self-reported daily-life impact across two 7-day windows. These summaries describe the records entered by the user; they are not clinical conclusions.
- **Menstrual cycle tracking:** Record period start and end dates, view recorded history, and calculate intervals between recorded start dates when enough records are available. These intervals are descriptive only and are not suitable for contraception or diagnosis.
- **Health calendar:** View recorded period dates alongside symptom entries. If an end date is not recorded, the calendar marks only the recorded start date rather than assuming the period duration.
- **Doctor visit preparation:** Save questions for a clinician and an optional medication/supplement list. Include relevant records in a printable visit summary.
- **Health guidance:** Access general educational information and links to sources such as WHO, NHS, and MedlinePlus. Refer to the source websites for current information.
- **In-app reminders:** Create, pause/activate, and delete symptom-tracking reminders. These are in-app reminders only; they do not send push notifications or alarms.
- **Display settings:** Choose browser-local theme, font-size, and density preferences.
- **Optional Health Assistant and note organiser:** If `GEMINI_API_KEY` is configured and the API request succeeds, the app can use Gemini for general health education and neutral note rewriting. Without a key, or if a request fails, the Health Assistant uses local general guidance and the note organiser only cleans whitespace. AI output should be reviewed by the user. These features do not diagnose or recommend treatment.

## Technology Stack

- **Frontend:** HTML templates, CSS, and JavaScript
- **Backend:** Python and Flask
- **Database:** SQLite
- **Authentication utilities:** Werkzeug password hashing, used with Flask session-based access
- **Deployment server:** Gunicorn
- **Optional external service:** Google Gemini API for selected assistant/note-organising functions

The core tracking, cycle-record, insight, reminder, and visit-preparation workflows do not require a Gemini API key.

## Requirements

- Python 3.11 or newer
- Dependencies listed in `requirements.txt`:
  - `Flask>=3.0,<4.0`
  - `gunicorn>=22.0,<24.0`

SQLite is accessed through Python's standard-library `sqlite3` module. Werkzeug is installed as a Flask dependency.

## Run Locally

1. Install Python 3.11 or newer.
2. Download or clone this repository and open a terminal in the project directory (the directory containing `app.py` and `requirements.txt`).
3. Create and activate a virtual environment (recommended).

   **Windows PowerShell:**

   ```powershell
   py -3.11 -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   **macOS/Linux:**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Set a strong `SECRET_KEY` environment variable before running the app. Do not use the development fallback secret for a deployed or shared environment.

   **Windows PowerShell:**

   ```powershell
   $env:SECRET_KEY = "replace-with-a-long-random-secret"
   ```

   **macOS/Linux:**

   ```bash
   export SECRET_KEY="replace-with-a-long-random-secret"
   ```

6. Start the application:

   ```bash
   python app.py
   ```

7. Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

The application creates/initialises its SQLite database when needed. By default, the database file is `herahealth.db` in the application directory. You can set `DATABASE_PATH` to use another location.

## Optional Gemini Configuration

HeraHealth can run without Gemini. To enable the optional Gemini-backed functions:

1. Obtain an API key through the official Google AI developer service.
2. Set `GEMINI_API_KEY` as a server-side environment variable.
3. Restart/redeploy the application and test the relevant feature end-to-end.

Never commit an API key to GitHub or put it in HTML, JavaScript, screenshots, or other public files. The presence of optional integration code does not by itself prove that the external API is configured or working.

## Deploy to Render

1. Push the project files to a **public GitHub repository** so hackathon judges can access the source code.
2. Create a Render Web Service connected to that repository.
3. Use these commands:

   **Build Command**

   ```bash
   pip install -r requirements.txt
   ```

   **Start Command**

   ```bash
   gunicorn app:app
   ```

4. In Render's Environment settings, set:
   - `SECRET_KEY` — a long, randomly generated secret.
   - `COOKIE_SECURE=1` — set when the app is served over HTTPS.
   - `DATABASE_PATH=/var/data/herahealth.db` — only if a persistent disk is attached and mounted at `/var/data`.
   - `GEMINI_API_KEY` — optional; only if you want to enable Gemini-backed functions.

### Database Persistence

The app reads the database location from `DATABASE_PATH`. If using a Render persistent disk, mount it at `/var/data` and set `DATABASE_PATH=/var/data/herahealth.db`. Check Render's current plan, persistent-disk availability, and pricing before choosing this setup.

Without persistent storage, SQLite data stored on an ephemeral filesystem may be lost when the service restarts or redeploys. A managed persistent database is another option. **Do not commit the database file to GitHub.**

After deployment, open the public URL and test registration, sign-in, symptom CRUD, cycle tracking, insights, reminders, and the printable visit summary. Confirm that data behaves as expected after a restart if persistence is required.

## Project Structure

```text
HeraHealth/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
└── static/
```

The project may contain additional template, static-asset, or support files. Keep all files required by the app in the repository, but do not commit `.venv/`, `__pycache__/`, secrets, or the SQLite database.

## Limitations and Safety

This is a hackathon MVP, not a production healthcare system. It has not undergone formal security, privacy, accessibility, or clinical validation audits. Do not use it to store real sensitive health information.

Before real-world use, it would need additional protections and review, including CSRF protection, password reset and email verification, rate limiting, stronger session/security policies, privacy consent and data export/deletion controls, audit logging, secure persistent storage, and professional review of health content.

Cycle intervals and symptom trends are descriptive summaries of user-entered records only. They must not be used to diagnose a condition, make contraception decisions, or replace advice from a qualified healthcare professional.

## Hackathon Demo Notes

- Use fictional accounts and health records in the demo.
- Explain that trend summaries reflect user-entered data and are not medical conclusions.
- Demonstrate the main workflow: sign in → add a symptom record → review insights and cycle calendar → prepare clinician questions → open/print the visit summary.
- Only present Gemini as an active feature if its key is configured and the relevant API-backed function has been tested successfully.

## References

- World Health Organization (WHO): [https://www.who.int/](https://www.who.int/)
- NHS: [https://www.nhs.uk/](https://www.nhs.uk/)
- MedlinePlus: [https://medlineplus.gov/](https://medlineplus.gov/)
- Flask documentation: [https://flask.palletsprojects.com/en/stable/](https://flask.palletsprojects.com/en/stable/)
- Python documentation: [https://docs.python.org/3/](https://docs.python.org/3/)
- SQLite documentation: [https://www.sqlite.org/docs.html](https://www.sqlite.org/docs.html)

The health websites above are entry points to the respective resources; consult the specific pages used for any health information included in the application.

