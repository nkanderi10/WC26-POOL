const ADMIN_PASSWORD = 'worldcup2026admin'; // MUST match script.js
const TOTAL_MATCHES  = 72;

const PTS_EXACT          = 5;
const PTS_CORRECT_RESULT = 3;
const PTS_GOAL_DIFF      = 1;

// ============================================================
//  doGet — handles ALL requests from the website
//  (GET requests avoid CORS issues; POST would be blocked)
// ============================================================
function doGet(e) {
  try {
    const payloadStr = e.parameter.payload;

    if (!payloadStr) {
      return jsonOut({ success: true, message: 'WC2026 Pool API is running ✅' });
    }

    const payload = JSON.parse(payloadStr);
    let result;

    switch (payload.action) {
      case 'ping':              result = { success: true };           break;
      case 'submitPredictions': result = submitPredictions(payload);  break;
      case 'getPredictions':    result = getPredictions(payload);     break;
      case 'getScores':         result = getScores();                 break;
      case 'updateScore':       result = updateScore(payload);        break;
      case 'setLock':           result = setLock(payload);            break;
      case 'getLeaderboard':    result = getLeaderboard();            break;
      default:
        result = { success: false, error: 'Unknown action: ' + payload.action };
    }

    return jsonOut(result);

  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function doPost(e) {
  // Forward any accidental POST to doGet handler for robustness
  try {
    const payload = JSON.parse(e.postData.contents);
    return jsonOut({ success: false, error: 'Please use GET requests. Re-deploy your script.js.' });
  } catch(err) {
    return jsonOut({ success: false, error: err.message });
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  SUBMIT / UPDATE PREDICTIONS
// ============================================================
function submitPredictions(payload) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Predictions');
  if (!sheet) return { success: false, error: 'Sheet "Predictions" not found. Create it first.' };

  const name      = String(payload.name || '').trim();
  const dept      = String(payload.dept || '').trim();
  const preds     = payload.predictions || {};
  const timestamp = payload.timestamp || new Date().toISOString();

  if (!name) return { success: false, error: 'Name is required.' };

  // Build header if sheet is empty
  if (sheet.getLastRow() === 0) buildPredictionsHeader(sheet);

  const data      = sheet.getDataRange().getValues();
  const headerRow = data[0];
  let userRowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === name.toLowerCase()) {
      userRowIndex = i + 1;
      break;
    }
  }

  const rowValues = buildRowValues(headerRow, name, dept, preds, timestamp);

  if (userRowIndex === -1) {
    sheet.appendRow(rowValues);
  } else {
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

  const name      = String(payload.name || '').trim().toLowerCase();
  const data      = sheet.getDataRange().getValues();
  const headerRow = data[0];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === name) {
      const predictions = {};
      for (let col = 3; col < headerRow.length; col += 2) {
        const header = String(headerRow[col]);
        const m = header.match(/^M(\d+)_/);
        if (!m) continue;
        const matchId = parseInt(m[1], 10);
        const home = data[i][col];
        const away = data[i][col + 1];
        if (home !== '' && away !== '' && home !== null && away !== null) {
          predictions[matchId] = { home: Number(home), away: Number(away) };
        }
      }
      return { success: true, predictions };
    }
  }

  return { success: true, predictions: null };
}

// ============================================================
//  GET SCORES (actual results)
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
    const locked  = data[i][3] === true || String(data[i][3]).toLowerCase() === 'true';
    if (!isNaN(matchId)) {
      scores[matchId] = {
        home:   (home !== '' && home !== null) ? Number(home) : null,
        away:   (away !== '' && away !== null) ? Number(away) : null,
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
  if (payload.adminPw !== ADMIN_PASSWORD) return { success: false, error: 'Unauthorized' };

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Scores');
  if (!sheet) return { success: false, error: 'Sheet "Scores" not found.' };

  const matchId = parseInt(payload.matchId, 10);
  const home    = Number(payload.home);
  const away    = Number(payload.away);
  if (isNaN(matchId) || isNaN(home) || isNaN(away)) return { success: false, error: 'Invalid data.' };

  ensureScoresHeader(sheet);
  const rowIndex = findOrCreateMatchRow(sheet, matchId);
  const existing = sheet.getRange(rowIndex, 1, 1, 4).getValues()[0];
  sheet.getRange(rowIndex, 1, 1, 4).setValues([[matchId, home, away, existing[3] || false]]);

  return { success: true };
}

// ============================================================
//  SET LOCK (admin)
// ============================================================
function setLock(payload) {
  if (payload.adminPw !== ADMIN_PASSWORD) return { success: false, error: 'Unauthorized' };

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Scores');
  if (!sheet) return { success: false, error: 'Sheet "Scores" not found.' };

  ensureScoresHeader(sheet);
  const matchId  = parseInt(payload.matchId, 10);
  const rowIndex = findOrCreateMatchRow(sheet, matchId);
  sheet.getRange(rowIndex, 4).setValue(Boolean(payload.locked));

  return { success: true };
}

// ============================================================
//  GET LEADERBOARD
// ============================================================
function getLeaderboard() {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const predSheet = ss.getSheetByName('Predictions');
  if (!predSheet || predSheet.getLastRow() < 2) return { success: true, leaderboard: [] };

  const scoresResp  = getScores();
  const actualScores = scoresResp.scores || {};
  const predData    = predSheet.getDataRange().getValues();
  const headerRow   = predData[0];
  const leaderboard = [];

  for (let i = 1; i < predData.length; i++) {
    const row  = predData[i];
    const name = String(row[0]).trim();
    const dept = String(row[1]).trim();
    const timestamp = String(row[2]).trim();
    if (!name) continue;

    let totalPts = 0, exactScores = 0, correctOutcomes = 0, gdBonuses = 0;

    for (let col = 3; col < headerRow.length; col += 2) {
      const m = String(headerRow[col]).match(/^M(\d+)_/);
      if (!m) continue;
      const matchId  = parseInt(m[1], 10);
      const predHome = row[col];
      const predAway = row[col + 1];
      if (predHome === '' || predAway === '' || predHome === null || predAway === null) continue;

      const actual = actualScores[matchId];
      if (!actual || actual.home === null || actual.away === null) continue;

      const pts = calcPoints(Number(predHome), Number(predAway), Number(actual.home), Number(actual.away));
      totalPts        += pts.total;
      if (pts.exact)   exactScores++;
      if (pts.correct) correctOutcomes++;
      if (pts.gdBonus) gdBonuses++;
    }

    leaderboard.push({ name, dept, timestamp, totalPts, exactScores, correctOutcomes, gdBonuses });
  }

  leaderboard.sort((a, b) => {
    if (b.totalPts !== a.totalPts)               return b.totalPts - a.totalPts;
    if (b.exactScores !== a.exactScores)         return b.exactScores - a.exactScores;
    if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  return { success: true, leaderboard };
}

// ============================================================
//  SCORING ENGINE
// ============================================================
function calcPoints(predH, predA, actH, actA) {
  const predRes = getResult(predH, predA);
  const actRes  = getResult(actH, actA);

  if (predH === actH && predA === actA) {
    return { total: PTS_EXACT, exact: true, correct: true, gdBonus: false };
  }
  if (predRes === actRes) {
    const gdBonus = (predH - predA) === (actH - actA);
    return { total: PTS_CORRECT_RESULT + (gdBonus ? PTS_GOAL_DIFF : 0), exact: false, correct: true, gdBonus };
  }
  return { total: 0, exact: false, correct: false, gdBonus: false };
}

function getResult(h, a) {
  return h > a ? 'home' : a > h ? 'away' : 'draw';
}

// ============================================================
//  HELPERS
// ============================================================
function buildPredictionsHeader(sheet) {
  const header = ['Name', 'Dept', 'Timestamp'];
  for (let i = 1; i <= TOTAL_MATCHES; i++) header.push(`M${i}_Home`, `M${i}_Away`);
  sheet.appendRow(header);
  const r = sheet.getRange(1, 1, 1, header.length);
  r.setBackground('#0f5428'); r.setFontColor('#ffffff'); r.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

function buildRowValues(headerRow, name, dept, preds, timestamp) {
  const row = new Array(headerRow.length).fill('');
  row[0] = name; row[1] = dept; row[2] = timestamp;
  for (let col = 3; col < headerRow.length; col += 2) {
    const m = String(headerRow[col]).match(/^M(\d+)_/);
    if (!m) continue;
    const matchId = parseInt(m[1], 10);
    const pred = preds[matchId];
    if (pred && pred.home !== undefined && pred.away !== undefined) {
      row[col] = pred.home; row[col + 1] = pred.away;
    }
  }
  return row;
}

function ensureScoresHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['MatchID', 'Home Goals', 'Away Goals', 'Locked']);
    const r = sheet.getRange(1, 1, 1, 4);
    r.setBackground('#0f5428'); r.setFontColor('#ffffff'); r.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function findOrCreateMatchRow(sheet, matchId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (parseInt(data[i][0], 10) === matchId) return i + 1;
  }
  sheet.appendRow([matchId, '', '', false]);
  return sheet.getLastRow();
}
