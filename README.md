# proj3ct
Student Buddy (Chrome Extension)

Study toolkit in your toolbar: To-Do list, Pomodoro timer, GPA calculator, quick links, and a lightweight site blocker.

Install (Developer Mode)
1. Open Chrome → Menu → Extensions → Manage Extensions.
2. Toggle on Developer mode (top-right).
3. Click "Load unpacked" and select this folder.

Features
- Tasks: Fast to-do list with persistence.
- Pomodoro: Focus/break sessions with alarm and notification.
- GPA: Simple GPA calculator with persistent rows.
- Links: Quick links in popup; manage via Options.
- Site Blocker: Block distracting domains; temporary 5-min bypass.

Permissions
- storage: Save settings and data.
- alarms: Trigger Pomodoro end.
- notifications: Notify when a session ends.
- <all_urls> host: Content script checks if current site is blocked.

Notes
- Icons are optional; if you want, add icon128.png in the root and set action.default_icon in manifest.json.
- This is Manifest V3.

Development Tips
- Edit files and reload the extension from the Extensions page.
- Popup devtools: Right-click the popup → Inspect.