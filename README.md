# Eug & Sav — A Decade of Us

A free, mobile-friendly, one-page vow renewal website with an RSVP form. Built for GitHub Pages + Google Sheets + Google Apps Script.

## 1. Customise the occasion

Open `index.html` in VS Code and update the wording (renewal date, ceremony time, venue, accommodation or travel notes) as plans are confirmed. The website currently **does not invent an event date or venue**: it says the anniversary is in 2027 and that the celebration date is to be announced.

Search for `Celebration date to be announced` and `Exact venue and directions to follow` to update them.

## 2. Create the RSVP Google Sheet

1. Open [Google Sheets](https://sheets.google.com), create a spreadsheet called **Eug & Sav — Vow Renewal RSVPs**.
2. Select **Extensions → Apps Script**.
3. Replace the script editor contents with `Code.gs` from this folder and save.
4. Choose the function **setup** from the dropdown and click **Run**. Grant the requested permissions. This creates the `RSVPs` tab and authorizes email access.
5. Click **Deploy → New deployment → gear icon → Web app**.
6. Choose **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**. Authorize if prompted.
7. Copy the deployed **Web app URL**, which ends in `/exec`.
8. In `index.html`, replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with the full copied URL.
9. Send a test **Yes** RSVP and a test **No** RSVP. Check the `RSVPs` sheet and `savvy.breen@gmail.com` inbox (and spam folder).

**IMPORTANT**: If you change `Code.gs` later, deploy a *new version* using **Deploy → Manage deployments → Edit → New version → Deploy**. Editing the code alone does not change an existing deployed version.

### How the RSVP works

- Visitors enter name, email, yes/no attendance, total people, guest names and an optional note.
- Each response is saved to the Google Sheet.
- A notification email is sent to `savvy.breen@gmail.com` for both acceptances and declines.
- The browser shows a success message only after the server confirms the Sheet write.
- A honeypot blocks basic spambots; submissions are validated server-side and request IDs help avoid duplicates.
- App Script email quotas apply. Anyone with the public URL can submit, so this is designed for a small private event, not high-volume public registrations. For more protection, use a CAPTCHA-backed form service or a server-side managed endpoint.
- Notification email failures are logged in the Apps Script executions, but the RSVP is still stored.

## 3. Host on GitHub Pages (free)

1. Create a **public** GitHub repository, e.g. `eug-and-sav`.
2. Upload **only `index.html`** for the website. Keep `Code.gs` out of the published pages, although it contains no passwords.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
5. Your site will be available at `https://YOUR-GITHUB-USERNAME.github.io/eug-and-sav/` once GitHub Pages deploys.

## 4. Connect a GoDaddy custom domain

1. Buy your preferred domain (availability and pricing need checking on GoDaddy).
2. In **GitHub → repository Settings → Pages → Custom domain**, enter your purchased domain (e.g. `eugandsav.ie`) and save.
3. In GoDaddy DNS, point the **apex/root** (`@`) with **four A records** to GitHub Pages:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
4. Optional: point **www** with a CNAME record to `YOUR-GITHUB-USERNAME.github.io` (not your repository path).
5. Wait for DNS verification and enable **Enforce HTTPS** in GitHub Pages when offered. Avoid keeping old or conflicting A/CNAME records.

Refer to the current GitHub Pages docs when making DNS changes: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## 5. Privacy and accessibility

The RSVP contains guest names and contact emails. Keep the Google Sheet private, share it only with event organisers, and delete the records when no longer needed. The public GitHub repository must never contain RSVP records or access credentials. To comply with applicable privacy laws, consider providing contact details for data requests and a deletion timeframe.

The site has keyboard-operable controls, form labels, validation and responsive layout. The heading fonts are loaded from Google Fonts; a serif/sans-serif fallback is configured.

## Domain ideas

- `eugandsav.ie`
- `eugandsav.com`
- `adecadeofus.ie`
- `backtokilfenora.ie`
- `kilfenoraagain.ie`
- `stillus.ie`
- `eugandsav10.ie`
- `savandeug.ie`
- `tenyearsofus.ie`
- `onceagaininkilfenora.ie`

These are ideas only, **not verified as available**.
