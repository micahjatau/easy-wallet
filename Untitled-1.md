Phase 4:
profile drop down loads but after logging in it bugs and shows loading continuously and account fails to load
data not synced on database tables
audit logging not working completely - no entry visible on audit log. Toast appears but no records of new entry
snapshots not saved either and does not appear on the list, no restore point button

Phase 5:
sync status is visible 
last sync does not update likely due to data not being synced to DB in phase 4
manual sync not working to likely a bug connecting to the database
sync setting okay

As you test, check off:
Authentication
- [ +] Anonymous mode works
- [ +] Sign up works
- [ +] Login works  
- [ +] Logout works
- [ +] Profile switcher UI works
Data Versioning
- [ -] Audit logs track creates
- [ -] Audit logs track updates
- [ -] Audit logs track deletes
- [ -] Manual snapshots work
- [ -] Restore from snapshot works
Sync System
- [ +] Sync status visible in header
- [ -] Manual sync works
- [ -] Auto-sync on data change works
- [ +] Offline mode works
- [ +] Sync settings work
Toasts & UX
- [ +] Success toasts appear
- [ -] Info toasts appear
- [ -] Error toasts appear (if errors occur)
- [ -] All actions have feedback
---

curl -X GET \
  'https://isthnyeniekrfvqivupg.supabase.co/auth/v1/user' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdGhueWVuaWVrcmZ2cWl2dXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjgyNDcsImV4cCI6MjA4NTUwNDI0N30.CCy979wJdHzJZvOVHk89fGW8fn3P0XUfxo_U1dm6SdA' \
  -H 'Authorization: Bearer 
curl -X GET \
  'https://isthnyeniekrfvqivupg.supabase.co/auth/v1/user' \-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdGhueWVuaWVrcmZ2cWl2dXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjgyNDcsImV4cCI6MjA4NTUwNDI0N30.CCy979wJdHzJZvOVHk89fGW8fn3P0XUfxo_U1dm6SdA' \-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdGhueWVuaWVrcmZ2cWl2dXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjgyNDcsImV4cCI6MjA4NTUwNDI0N30.CCy979wJdHzJZvOVHk89fGW8fn3P0XUfxo_U1dm6SdA'