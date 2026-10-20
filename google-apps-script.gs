const SHEET_NAME = 'Waitlist';
const HEADERS = [
  'Submitted at',
  'Source',
  'WhatsApp number',
  'Current size',
  'Bras',
  'Clothing',
  'Fit tester',
  'Recommended size',
  'UK size',
  'Fit issues',
  'Underbust',
  'Overbust'
];

function doPost(event) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const sheet = getWaitlistSheet();
      const values = event.parameter || {};

      sheet.appendRow([
        new Date(),
        safeCell(values.source),
        safeCell(values.whatsapp || values.email),
        safeCell(values.currentSize),
        values.bras === 'true' ? 'Yes' : 'No',
        values.clothing === 'true' ? 'Yes' : 'No',
        values.fitTester === 'true' ? 'Yes' : 'No',
        safeCell(values.recommendedSize),
        safeCell(values.ukSize),
        safeCell(values.issues),
        safeCell(values.underbust),
        safeCell(values.overbust)
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message });
  }
}

function getWaitlistSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  } else if (sheet.getRange(1, 3).getValue() === 'Email') {
    sheet.getRange(1, 3).setValue('WhatsApp number');
  }

  return sheet;
}

function safeCell(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
