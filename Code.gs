/**
 * Eug & Sav RSVP backend — paste this into the Apps Script project attached to your Google Sheet.
 * Sheet menu: Extensions > Apps Script.
 * Run setup() once from the editor, accept permissions, then deploy as Web app.
 */
const EMAIL_TO = 'savvy.breen@gmail.com';
const SHEET_NAME = 'RSVPs';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Attending', 'Total Attending', 'Other Guests', 'Message', 'Request ID'];

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Create this script from inside the Google Sheet (Extensions > Apps Script).');
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  // Prompts Google to request permission to send notifications when you run setup().
  MailApp.getRemainingDailyQuota();
}

function doPost(e) {
  const params = e && e.parameter ? e.parameter : {};
  const requestId = String(params.requestId || '').slice(0, 100);
  try {
    if (params.website) return reply_(true, 'OK', requestId); // hidden honeypot: ignore bot submissions
    const name = clean_(params.name, 120);
    const email = clean_(params.email, 200);
    const attendance = String(params.attendance || '');
    const message = clean_(params.message, 1000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['Yes', 'No'].includes(attendance)) {
      throw new Error('Please complete your name, email and attendance choice.');
    }
    const guests = attendance === 'Yes' ? Number(params.guests || 1) : 0;
    if (attendance === 'Yes' && (!Number.isInteger(guests) || guests < 1 || guests > 6)) {
      throw new Error('Please select a valid number of guests.');
    }
    const guestNames = attendance === 'Yes' ? clean_(params.guestNames, 300) : '';

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('RSVP sheet not configured. Run setup() first.');
      // Prevent duplicate entries from repeated browser submissions.
      if (requestId && sheet.getLastRow() > 1) {
        const ids = sheet.getRange(2, 8, sheet.getLastRow() - 1, 1).getValues();
        if (ids.some(row => String(row[0]) === requestId)) return reply_(true, 'Already received', requestId);
      }
      sheet.appendRow([new Date(), safeCell_(name), safeCell_(email), attendance, guests, safeCell_(guestNames), safeCell_(message), requestId]);
    } finally {
      lock.releaseLock();
    }

    // Email delivery is attempted after recording the RSVP: a mail outage does not lose the response.
    try {
      const subject = `Vow renewal RSVP: ${name} — ${attendance === 'Yes' ? 'ACCEPTED' : 'DECLINED'}`;
      const body = [`New RSVP for Eug & Sav`, '', `Name: ${name}`, `Email: ${email}`, `Attending: ${attendance}`, `Total attending: ${guests}`, `Other guests: ${guestNames || '—'}`, `Message: ${message || '—'}`, '', 'The response is also saved to your Google Sheet.'].join('\n');
      MailApp.sendEmail({to:EMAIL_TO, subject, body, replyTo:email, name:'Eug & Sav RSVP'});
    } catch (mailError) { console.error('RSVP saved, but email notification failed: ' + mailError); }
    return reply_(true, 'RSVP received', requestId);
  } catch (err) {
    console.error(err);
    return reply_(false, err.message || 'Unable to save RSVP.', requestId);
  }
}
function clean_(value, max) { return String(value || '').trim().slice(0, max); }
function safeCell_(value) { return /^[=+\-@\t\r]/.test(value) ? "'" + value : value; }
function reply_(ok, message, requestId) {
  const payload = JSON.stringify({type:'eug-sav-rsvp', ok, message, requestId}).replace(/</g, '\\u003c');
  const html = `<!doctype html><html><body><script>window.parent.postMessage(${payload}, '*');<\/script></body></html>`;
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
