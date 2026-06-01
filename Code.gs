const ADMIN_PASSWORD = 'worldcup2026admin'; // CHANGE THIS — must match script.js
const TOTAL_MATCHES  = 72;

// ── Scoring constants ────────────────────────────────────────
const PTS_EXACT         = 5;
const PTS_CORRECT_RESULT= 3;
const PTS_GOAL_DIFF     = 1;

// ============================================================
//  ENTRY POINT — handles all POST requests from the website
// ============================================================
function doPost(e) {
  const cors = ContentService.createTextOutput();

  try {
    const payload = JSON.parse(e.postData.contents);
    let result;

    switch (payload.action) {
      case 'submitPredictions': result = submitPredictions(payload); break;
      case 'getPredictions':    result = getPredictions(payload);    break;
      case 'getScores':         result = getScores();                break;
      case 'updateScore':       result = updateScore(payload);       break;
      case 'setLock':           result = setLock(payload);           break;
      case 'getLeaderboard':    result = getLeaderboard();           break;
      default:
        result = { success: false, error: 'Unknown action: ' + payload.action };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Also support GET for simple testing
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getLeaderboard') {
    return ContentService
      .createTextOutput(JSON.stringify(getLeaderboard()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'WC2026 Pool API running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  SUBMIT / UPDATE PREDICTIONS
//  Payload: { name, dept, predictions: {matchId: {home, away}}, timestamp }
// ============================================================
function submitPredictions(payload) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Predictions');

  if (!sheet) return { success: false, error: 'Sheet "Predictions" not found.' };

  const name      = String(payload.name || '').trim();
  const dept      = String(payload.dept || '').trim();
  const preds     = payload.predictions || {};
  const timestamp = payload.timestamp || new Date().toISOString();

  if (!name) return { success: false, error: 'Name is required.' };

  // Build header row if empty
  if (sheet.getLastRow() === 0) {
    buildPredictionsHeader(sheet);
  }

  // Check if user already submitted — find their row
  const data      = sheet.getDataRange().getValues();
  const headerRow = data[0];
  let userRowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === name.toLowerCase()) {
      userRowIndex = i + 1; // 1-based sheet row
      break;
    }
  }

  // Build the row values
  const rowValues = buildRowValues(headerRow, name, dept, preds, timestamp);

  if (userRowIndex === -1) {
    // New submission — append
    sheet.appendRow(rowValues);
  } else {
    // Update existing row
    sheet.getRange(userRowIndex, 1, 1, rowValues.length).setValues([rowValues]);
  }

  return { success: true };
}

// ============================================================
//  GET PREDICTIONS for a specific user
// ============================================================
function getPredictions(payload) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Predictions');

  if (!sheet || sheet.getLastRow() < 2) return { success: true, predictions: null };

  const name = String(payload.name || '').trim().toLowerCase();
  const data = sheet.getDataRange().getValues();
  const headerRow = data[0];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === name) {
      const predictions = {};
      for (let col = 3; col < headerRow.length; col += 2) {
        const header = String(headerRow[col]);
        const matchIdMatch = header.match(/^M(\d+)_/);
        if (!matchIdMatch) continue;
        const matchId = parseInt(matchIdMatch[1], 10);
        const home = data[i][col];
        const away = data[i][col + 1];
        if (home !== '' && away !== '') {
          predictions[matchId] = { home: Number(home), away: Number(away) };
        }
      }
      return { success: true, predictions };
    }
  }

  return { success: true, predictions: null };
}

// ============================================================
//  GET SCORES (actual results for all matches)
// ============================================================
function getScores() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Scores');

  if (!sheet || sheet.getLastRow() < 2) return { success: true, scores: {} };

  const data   = sheet.getDataRange().getValues();
  const scores = {};

  for (let i = 1; i < data.length; i++) {
    const matchId = parseInt(data[i][0], 10);
    const home    = data[i][1];
    const away    = data[i][2];
    const locked  = data[i][3] === true || data[i][3] === 'TRUE' || data[i][3] === 'true';

    if (!isNaN(matchId)) {
      scores[matchId] = {
        home:   home !== '' && home !== null ? Number(home) : null,
        away:   away !== '' && away !== null ? Number(away) : null,
        locked: locked,
      };
    }
  }

  return { success: true, scores };
}

// ============================================================
//  UPDATE SCORE (admin)
// ============================================================
function updateScore(payload) {
  if (payload.adminPw !== ADMIN_PASSWORD) {
    return { success: false, error: 'Unauthorized' };
  }

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Scores');

  if (!sheet) return { success: false, error: 'Sheet "Scores" not found.' };

  const matchId = parseInt(payload.matchId, 10);
  const home    = Number(payload.home);
  const away    = Number(payload.away);

  if (isNaN(matchId) || isNaN(home) || isNaN(away)) {
    return { success: false, error: 'Invalid data.' };
  }

  ensureScoresSheet(sheet);

  const rowIndex = findOrCreateMatchRow(sheet, matchId);
  const row = sheet.getRange(rowIndex, 1, 1, 4).getValues()[0];
  sheet.getRange(rowIndex, 1, 1, 4).setValues([[matchId, home, away, row[3] || false]]);

  return { success: true };
}

// ============================================================
//  SET LOCK (admin)
// ============================================================
function setLock(payload) {
  if (payload.adminPw !== ADMIN_PASSWORD) {
    return { success: false, error: 'Unauthorized' };
  }

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Scores');

  if (!sheet) return { success: false, error: 'Sheet "Scores" not found.' };

  const matchId = parseInt(payload.matchId, 10);
  const locked  = Boolean(payload.locked);

  ensureScoresSheet(sheet);

  const rowIndex = findOrCreateMatchRow(sheet, matchId);
  const row = sheet.getRange(rowIndex, 1, 1, 4).getValues()[0];
  sheet.getRange(rowIndex, 4).setValue(locked);

  return { success: true };
}

// ============================================================
//  GET LEADERBOARD — calculates points from scratch
// ============================================================
function getLeaderboard() {
  const ss          = SpreadsheetApp.getActiveSpreadsheet();
  const predSheet   = ss.getSheetByName('Predictions');
  const scoresSheet = ss.getSheetByName('Scores');

  if (!predSheet || predSheet.getLastRow() < 2) {
    return { success: true, leaderboard: [] };
  }

  // Load actual scores
  const scoresData = getScores();
  const actualScores = scoresData.scores || {};

  // Load all predictions
  const predData   = predSheet.getDataRange().getValues();
  const headerRow  = predData[0];

  const leaderboard = [];

  for (let i = 1; i < predData.length; i++) {
    const row  = predData[i];
    const name = String(row[0]).trim();
    const dept = String(row[1]).trim();
    const timestamp = String(row[2]).trim();

    if (!name) continue;

    let totalPts        = 0;
    let exactScores     = 0;
    let correctOutcomes = 0;
    let gdBonuses       = 0;

    // Parse predictions for this user
    for (let col = 3; col < headerRow.length; col += 2) {
      const header = String(headerRow[col]);
      const matchIdMatch = header.match(/^M(\d+)_/);
      if (!matchIdMatch) continue;
      const matchId = parseInt(matchIdMatch[1], 10);

      const predHome = row[col];
      const predAway = row[col + 1];

      if (predHome === '' || predAway === '' || predHome === null || predAway === null) continue;

      const actual = actualScores[matchId];
      if (!actual || actual.home === null || actual.away === null) continue;

      const pts = calculatePoints(
        Number(predHome), Number(predAway),
        Number(actual.home), Number(actual.away)
      );

      totalPts += pts.total;
      if (pts.exact)   exactScores++;
      if (pts.correct) correctOutcomes++;
      if (pts.gdBonus) gdBonuses++;
    }

    leaderboard.push({ name, dept, timestamp, totalPts, exactScores, correctOutcomes, gdBonuses });
  }

  // Sort: pts → exact → correct → timestamp
  leaderboard.sort((a, b) => {
    if (b.totalPts !== a.totalPts)           return b.totalPts - a.totalPts;
    if (b.exactScores !== a.exactScores)     return b.exactScores - a.exactScores;
    if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  return { success: true, leaderboard };
}

// ============================================================
//  SCORING ENGINE
//  Returns { total, exact, correct, gdBonus }
// ============================================================
function calculatePoints(predHome, predAway, actualHome, actualAway) {
  const predResult   = getResult(predHome, predAway);
  const actualResult = getResult(actualHome, actualAway);

  // Exact score
  if (predHome === actualHome && predAway === actualAway) {
    return { total: PTS_EXACT, exact: true, correct: true, gdBonus: false };
  }

  // Correct result
  if (predResult === actualResult) {
    const predGD   = predHome - predAway;
    const actualGD = actualHome - actualAway;
    const gdBonus  = (predGD === actualGD) ? PTS_GOAL_DIFF : 0;
    return {
      total:   PTS_CORRECT_RESULT + gdBonus,
      exact:   false,
      correct: true,
      gdBonus: gdBonus > 0,
    };
  }

  // Wrong outcome
  return { total: 0, exact: false, correct: false, gdBonus: false };
}

function getResult(home, away) {
  if (home > away)  return 'home';
  if (away > home)  return 'away';
  return 'draw';
}

// ============================================================
//  HELPERS
// ============================================================
function buildPredictionsHeader(sheet) {
  // Columns: Name | Dept | Timestamp | M1_Home | M1_Away | M2_Home | M2_Away | ...
  const header = ['Name', 'Dept', 'Timestamp'];
  for (let i = 1; i <= TOTAL_MATCHES; i++) {
    header.push(`M${i}_Home`, `M${i}_Away`);
  }
  sheet.appendRow(header);

  // Style header
  const headerRange = sheet.getRange(1, 1, 1, header.length);
  headerRange.setBackground('#0f5428');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function buildRowValues(headerRow, name, dept, preds, timestamp) {
  const row = new Array(headerRow.length).fill('');
  row[0] = name;
  row[1] = dept;
  row[2] = timestamp;

  for (let col = 3; col < headerRow.length; col += 2) {
    const header = String(headerRow[col]);
    const matchIdMatch = header.match(/^M(\d+)_/);
    if (!matchIdMatch) continue;
    const matchId = parseInt(matchIdMatch[1], 10);
    const pred = preds[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined) {
      row[col]     = pred.home;
      row[col + 1] = pred.away;
    }
  }

  return row;
}

function ensureScoresSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    const header = ['MatchID', 'Home Goals', 'Away Goals', 'Locked'];
    sheet.appendRow(header);
    const headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setBackground('#0f5428');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function findOrCreateMatchRow(sheet, matchId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (parseInt(data[i][0], 10) === matchId) return i + 1; // 1-based
  }
  // Not found — append
  sheet.appendRow([matchId, '', '', false]);
  return sheet.getLastRow();
}
