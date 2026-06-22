╔══════════════════════════════════════════════════════════════════╗
║           ProveIt! Beta Landing Page — Complete Setup Guide      ║
║                  Follow every step in exact order                ║
╚══════════════════════════════════════════════════════════════════╝

You need to complete 4 setup tasks before deploying:
  1. Google Drive upload folder
  2. Google Sheets tracking spreadsheet + webhook
  3. Deploy to Vercel
  4. Update the CONFIG in App.jsx with your real links

Each task is explained below in full detail.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 1 — CREATE YOUR GOOGLE DRIVE UPLOAD FOLDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is where applicants upload their school reports.

Step 1: Go to https://drive.google.com and log in with your Gmail
Step 2: Click "+ New" → "New folder"
Step 3: Name it exactly: ProveIt Beta — School Reports
Step 4: Click "Create"
Step 5: Right-click the new folder → "Share"
Step 6: Under "General access" change it to "Anyone with the link"
Step 7: Set the role to "Editor" (so applicants can upload)
Step 8: Click "Copy link" — it will look like:
         https://drive.google.com/drive/folders/1ABC123XYZetc
Step 9: Save this link — you'll need it in Task 4


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 2 — CREATE YOUR GOOGLE SHEETS TRACKING SPREADSHEET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every application will automatically fill a row in this sheet.

PART A — Create the spreadsheet
─────────────────────────────────────────────
Step 1:  Go to https://sheets.google.com
Step 2:  Click "+ Blank" to create a new spreadsheet
Step 3:  Rename it: ProveIt Beta Applications
         (click the title at the top to rename)
Step 4:  In Row 1, type these headers in columns A through L:
         A1: Submission ID
         B1: Date Applied
         C1: Name
         D1: Email
         E1: Phone
         F1: Role
         G1: Grade
         H1: Subjects
         I1: Devices
         J1: Heard Via
         K1: Report Uploaded
         L1: Status
Step 5:  Select Row 1 → make it bold (Ctrl+B)
Step 6:  In column L, for every new row you'll manually type:
         Pending / Accepted / Rejected

PART B — Create the Apps Script webhook
─────────────────────────────────────────────
This makes form submissions appear automatically in your sheet.

Step 1:  In your Google Sheet, click "Extensions" in the top menu
Step 2:  Click "Apps Script"
Step 3:  A new tab opens with a code editor
Step 4:  Delete everything in the editor
Step 5:  Paste this code exactly:

─────────────── COPY FROM HERE ───────────────
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.submissionId,
      data.date,
      data.name,
      data.email,
      data.phone || "",
      data.role,
      data.grade,
      data.subjects,
      data.devices,
      data.hearAbout || "",
      data.reportUploaded,
      data.status
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({result: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({result: "error", error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
─────────────── COPY TO HERE ───────────────

Step 6:  Click the floppy disk icon (Save) — name it "ProveIt Beta"
Step 7:  Click "Deploy" (top right blue button)
Step 8:  Click "New deployment"
Step 9:  Click the gear ⚙️ icon next to "Type" → select "Web app"
Step 10: Fill in these settings:
          Description: ProveIt Beta Webhook
          Execute as: Me
          Who has access: Anyone
Step 11: Click "Deploy"
Step 12: Google will ask you to authorise — click "Authorise access"
Step 13: Choose your Gmail account
Step 14: You may see "Google hasn't verified this app" — click
          "Advanced" → "Go to ProveIt Beta (unsafe)" → "Allow"
Step 15: You'll get a URL that looks like:
          https://script.google.com/macros/s/AKfyc.../exec
Step 16: COPY this URL — you need it in Task 4

IMPORTANT: Every time you make a code change in Apps Script,
you must click Deploy → New deployment to get a fresh URL.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 3 — DEPLOY TO VERCEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART A — Create a new GitHub repository
─────────────────────────────────────────────
Step 1:  Go to https://github.com and log in
Step 2:  Click "+" (top right) → "New repository"
Step 3:  Repository name: proveit-beta
Step 4:  Set to Public
Step 5:  Do NOT tick any "Initialize" boxes
Step 6:  Click "Create repository"
Step 7:  Click "uploading an existing file"
Step 8:  Upload ALL files from the proveit-beta folder:
            package.json
            vite.config.js
            index.html
            vercel.json
            SETUP_INSTRUCTIONS.txt
            src/ folder (contains App.jsx and main.jsx)
            public/ folder (contains favicon.svg)
         NOTE: Upload the src and public folders by dragging
         the entire folder into the upload area
Step 9:  Click "Commit changes"

PART B — Deploy on Vercel
─────────────────────────────────────────────
Step 1:  Go to https://vercel.com and log in
Step 2:  Click "Add New..." → "Project"
Step 3:  Find "proveit-beta" and click "Import"
Step 4:  On the configuration screen:
          Framework Preset: Vite
          Root Directory: ./ (leave as default)
          Build Command: npm run build
          Output Directory: dist
Step 5:  Click "Deploy"
Step 6:  Wait about 60 seconds
Step 7:  You'll get a URL like: https://proveit-beta-abc123.vercel.app
         This is your live beta landing page!
Step 8:  Note this URL — you'll need it in Task 4


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK 4 — UPDATE THE CONFIG IN APP.JSX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now you have all the links. Update the CONFIG at the top of App.jsx.

Step 1:  Open App.jsx in your proveit-beta GitHub repository
Step 2:  Click the pencil ✏️ edit icon
Step 3:  Find these lines near the very top of the file:

         const CONFIG = {
           totalSlots:        100,
           acceptedSlots:     80,
           applicationsCount: 23,
           driveUploadLink:   "https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE",
           sheetsWebhook:     "YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE",
           emailjsPublicKey:  "6KYo6SqjlDABOmVpE",
           emailjsServiceId:  "proveit_gmail",
           emailjsTemplateId: "proveit_notify",
         };

Step 4:  Replace the placeholder values:
         driveUploadLink → paste your Google Drive folder link from Task 1
         sheetsWebhook   → paste your Apps Script webhook URL from Task 2

Step 5:  The emailjs values are already correct — leave them as is

Step 6:  Click "Commit changes" — Vercel redeploys automatically


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ONGOING MANAGEMENT — WHAT TO DO AS APPLICATIONS COME IN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UPDATING THE COUNTER
─────────────────────────────────────────────
The live counter on the landing page is controlled by one number
in the CONFIG. Update it as applications come in:

Step 1:  Go to your proveit-beta GitHub repo → src/App.jsx
Step 2:  Click ✏️ edit
Step 3:  Find: applicationsCount: 23,
Step 4:  Change 23 to however many applications you have
Step 5:  Commit changes → Vercel updates in 30 seconds

Do this every few days or whenever you want to create urgency.


REVIEWING APPLICATIONS
─────────────────────────────────────────────
1. Open your Google Sheet (ProveIt Beta Applications)
2. Each application appears as a new row automatically
3. Review the applicant's details
4. Change column L (Status) from "Pending" to:
   - "Accepted" — you want them
   - "Rejected" — not the right fit
   - "Waitlisted" — maybe later

ACCEPTING AN APPLICANT
─────────────────────────────────────────────
When you accept someone:
1. Mark them "Accepted" in the sheet
2. Go to ProveIt! → Student Management → Add Student
3. Enter their name, email and a temporary password
4. Select their subjects
5. The enrolment email fires automatically with their login details

REJECTING AN APPLICANT
─────────────────────────────────────────────
When you reject someone, send them a personal email from
info.proveit@yahoo.com:

Subject: ProveIt! Beta — Application Update

Hi [Name],

Thank you for applying to the ProveIt! Beta Programme.

After reviewing your application, we unfortunately don't have a
matching slot available right now. We received more applications
than expected and had to make some tough decisions.

We'd love to have you when we open publicly. We'll be in touch.

The ProveIt! Team


CLOSING APPLICATIONS
─────────────────────────────────────────────
When you've accepted your 80 testers:
1. Edit App.jsx → change applicationsCount to 100
2. The form will still show but urgency is maximum
3. Or add a "Applications Closed" message by changing
   totalSlots to match applicationsCount


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR LINKS — FILL THESE IN AS YOU COMPLETE EACH TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Beta Landing Page (Vercel):   https://____________________________
ProveIt! App (Vercel):        https://____________________________
Google Drive Upload Folder:   https://____________________________
Google Sheets Tracker:        https://____________________________
Apps Script Webhook:          https://____________________________
GitHub (beta):                https://github.com/______/proveit-beta
GitHub (app):                 https://github.com/______/proveit


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TESTING CHECKLIST — DO THIS BEFORE SHARING THE PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ ] Open the landing page on your phone and laptop
[ ] Submit a test application with your own email
[ ] Check your email for the confirmation message
[ ] Check Google Sheets — does the test row appear?
[ ] Click the Drive upload link — does it open correctly?
[ ] Submit as a Grade 8 student — does the block message show?
[ ] Submit as a Grade 12 student — does it go through?
[ ] Check that the counter number is showing correctly
[ ] Test all mailto: links in the footer


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Share a screenshot with Claude and every issue has a fix.
