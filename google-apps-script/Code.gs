const SHEET_NAME = 'Sheet1';
// Google Sheet URL se /d/ aur /edit ke beech wala part yahan paste karo.
// Example: https://docs.google.com/spreadsheets/d/1AbCDefGhIJkLmNoPQRstuVwxYZ1234567890/edit
const SPREADSHEET_ID = 'https://docs.google.com/spreadsheets/d/1ouT8SFCbLJmAcbP7LFdIylQPccZFjI_mUIlWk7JM0mg/edit';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Feedback API is running.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawData = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(rawData);

    if (!data.name || !data.email || !data.message) {
      return jsonResponse('error', 'Missing required fields.');
    }

    var sheet;
    try {
      sheet = getSheet();
    } catch (err) {
      return jsonResponse('error', 'Cannot open spreadsheet: ' + String(err.message || err));
    }
    sheet.appendRow([
      data.name,
      data.email,
      data.message,
      data.timestamp ? new Date(data.timestamp) : new Date()
    ]);

    return jsonResponse('success', 'Feedback saved successfully.');
  } catch (error) {
    return jsonResponse('error', error.message || 'Something went wrong.');
  }
}

function getSheet() {
  var id = normalizeSpreadsheetId(SPREADSHEET_ID);
  if (!id) throw new Error('Invalid spreadsheet id');
  var spreadsheet = SpreadsheetApp.openById(id);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Name', 'Email', 'Message', 'Timestamp']);
  }

  return sheet;
}

// Accept either a plain spreadsheet ID or a full Google Sheets URL and
// extract the ID when necessary.
function normalizeSpreadsheetId(input) {
  if (!input) return null;
  input = String(input).trim();
  // If user accidentally pasted the full URL, extract the ID between /d/ and /edit
  var match = input.match(/\/d\/([a-zA-Z0-9-_]+)(?:\/|$)/);
  if (match && match[1]) return match[1];
  // Otherwise assume they provided the ID directly
  if (/^[a-zA-Z0-9-_]{10,}$/.test(input)) return input;
  return null;
}

function jsonResponse(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: status,
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
