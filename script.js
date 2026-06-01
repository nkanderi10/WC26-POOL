const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJdbRq3IntXHxQk6_EKfMAFyvPNbfR3BzThwmH-EKhG8LbmIf8mKGWtDa3Pn41943l/exec';
const ADMIN_PASSWORD  = 'worldcup2026admin'; // change this

// ============================================================
// MATCH DATA — All 72 Group-Stage Matches
// Kuwait Time = Eastern Daylight Time + 7 hours
// Source: beIN Sports / worldcuppass.com (June 2026)
// ============================================================
const MATCHES = [
  // ── GROUP A ──────────────────────────────────────────────
  { id:1,  group:'A', date:'2026-06-11', dateDisplay:'Thu, Jun 11', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Mexico',       away:'South Africa',        venue:'Mexico City'      },
  { id:2,  group:'A', date:'2026-06-11', dateDisplay:'Thu, Jun 11', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'South Korea',  away:'Czechia',             venue:'Guadalajara'      },
  { id:3,  group:'A', date:'2026-06-18', dateDisplay:'Thu, Jun 18', etTime:'12:00 PM', kwtTime:'7:00 PM',  home:'Czechia',      away:'South Africa',        venue:'Atlanta'          },
  { id:4,  group:'A', date:'2026-06-18', dateDisplay:'Thu, Jun 18', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'Mexico',       away:'South Korea',         venue:'Guadalajara'      },
  { id:5,  group:'A', date:'2026-06-24', dateDisplay:'Wed, Jun 24', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'Czechia',      away:'Mexico',              venue:'Mexico City'      },
  { id:6,  group:'A', date:'2026-06-24', dateDisplay:'Wed, Jun 24', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'South Africa', away:'South Korea',         venue:'Monterrey'        },

  // ── GROUP B ──────────────────────────────────────────────
  { id:7,  group:'B', date:'2026-06-12', dateDisplay:'Fri, Jun 12', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Canada',       away:'Bosnia & Herzegovina',venue:'Toronto'          },
  { id:8,  group:'B', date:'2026-06-13', dateDisplay:'Sat, Jun 13', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Qatar',        away:'Switzerland',         venue:'San Francisco'    },
  { id:9,  group:'B', date:'2026-06-18', dateDisplay:'Thu, Jun 18', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Switzerland',  away:'Bosnia & Herzegovina',venue:'Los Angeles'      },
  { id:10, group:'B', date:'2026-06-18', dateDisplay:'Thu, Jun 18', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Canada',       away:'Qatar',               venue:'Vancouver'        },
  { id:11, group:'B', date:'2026-06-24', dateDisplay:'Wed, Jun 24', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Switzerland',  away:'Canada',              venue:'Vancouver'        },
  { id:12, group:'B', date:'2026-06-24', dateDisplay:'Wed, Jun 24', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Bosnia & Herzegovina',away:'Qatar',         venue:'Seattle'          },

  // ── GROUP C ──────────────────────────────────────────────
  { id:13, group:'C', date:'2026-06-13', dateDisplay:'Sat, Jun 13', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Brazil',       away:'Morocco',             venue:'New York/NJ'      },
  { id:14, group:'C', date:'2026-06-13', dateDisplay:'Sat, Jun 13', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'Haiti',        away:'Scotland',            venue:'Boston'           },
  { id:15, group:'C', date:'2026-06-19', dateDisplay:'Fri, Jun 19', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Scotland',     away:'Morocco',             venue:'Boston'           },
  { id:16, group:'C', date:'2026-06-19', dateDisplay:'Fri, Jun 19', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'Brazil',       away:'Haiti',               venue:'Philadelphia'     },
  { id:17, group:'C', date:'2026-06-24', dateDisplay:'Wed, Jun 24', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Scotland',     away:'Brazil',              venue:'Miami'            },
  { id:18, group:'C', date:'2026-06-24', dateDisplay:'Wed, Jun 24', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Morocco',      away:'Haiti',               venue:'Atlanta'          },

  // ── GROUP D ──────────────────────────────────────────────
  { id:19, group:'D', date:'2026-06-12', dateDisplay:'Fri, Jun 12', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'USA',          away:'Paraguay',            venue:'Los Angeles'      },
  { id:20, group:'D', date:'2026-06-13', dateDisplay:'Sat, Jun 13', etTime:'12:00 AM', kwtTime:'7:00 AM',  home:'Australia',    away:'Türkiye',             venue:'Vancouver'        },
  { id:21, group:'D', date:'2026-06-19', dateDisplay:'Fri, Jun 19', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'USA',          away:'Australia',           venue:'Seattle'          },
  { id:22, group:'D', date:'2026-06-19', dateDisplay:'Fri, Jun 19', etTime:'12:00 AM', kwtTime:'7:00 AM',  home:'Türkiye',      away:'Paraguay',            venue:'San Francisco'    },
  { id:23, group:'D', date:'2026-06-25', dateDisplay:'Thu, Jun 25', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Türkiye',      away:'USA',                 venue:'Los Angeles'      },
  { id:24, group:'D', date:'2026-06-25', dateDisplay:'Thu, Jun 25', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Paraguay',     away:'Australia',           venue:'San Francisco'    },

  // ── GROUP E ──────────────────────────────────────────────
  { id:25, group:'E', date:'2026-06-14', dateDisplay:'Sun, Jun 14', etTime:'1:00 PM',  kwtTime:'8:00 PM',  home:'Germany',      away:'Curaçao',             venue:'Houston'          },
  { id:26, group:'E', date:'2026-06-14', dateDisplay:'Sun, Jun 14', etTime:'7:00 PM',  kwtTime:'2:00 AM+', home:'Ivory Coast',  away:'Ecuador',             venue:'Philadelphia'     },
  { id:27, group:'E', date:'2026-06-20', dateDisplay:'Sat, Jun 20', etTime:'4:00 PM',  kwtTime:'11:00 PM', home:'Germany',      away:'Ivory Coast',         venue:'Toronto'          },
  { id:28, group:'E', date:'2026-06-20', dateDisplay:'Sat, Jun 20', etTime:'8:00 PM',  kwtTime:'3:00 AM+', home:'Ecuador',      away:'Curaçao',             venue:'Kansas City'      },
  { id:29, group:'E', date:'2026-06-25', dateDisplay:'Thu, Jun 25', etTime:'4:00 PM',  kwtTime:'11:00 PM', home:'Ecuador',      away:'Germany',             venue:'New York/NJ'      },
  { id:30, group:'E', date:'2026-06-25', dateDisplay:'Thu, Jun 25', etTime:'4:00 PM',  kwtTime:'11:00 PM', home:'Curaçao',      away:'Ivory Coast',         venue:'Philadelphia'     },

  // ── GROUP F ──────────────────────────────────────────────
  { id:31, group:'F', date:'2026-06-14', dateDisplay:'Sun, Jun 14', etTime:'4:00 PM',  kwtTime:'11:00 PM', home:'Netherlands',  away:'Japan',               venue:'Dallas'           },
  { id:32, group:'F', date:'2026-06-14', dateDisplay:'Sun, Jun 14', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Sweden',       away:'Tunisia',             venue:'Monterrey'        },
  { id:33, group:'F', date:'2026-06-20', dateDisplay:'Sat, Jun 20', etTime:'1:00 PM',  kwtTime:'8:00 PM',  home:'Netherlands',  away:'Sweden',              venue:'Houston'          },
  { id:34, group:'F', date:'2026-06-20', dateDisplay:'Sat, Jun 20', etTime:'12:00 AM', kwtTime:'7:00 AM',  home:'Tunisia',      away:'Japan',               venue:'Monterrey'        },
  { id:35, group:'F', date:'2026-06-25', dateDisplay:'Thu, Jun 25', etTime:'7:00 PM',  kwtTime:'2:00 AM+', home:'Japan',        away:'Sweden',              venue:'Dallas'           },
  { id:36, group:'F', date:'2026-06-25', dateDisplay:'Thu, Jun 25', etTime:'7:00 PM',  kwtTime:'2:00 AM+', home:'Tunisia',      away:'Netherlands',         venue:'Kansas City'      },

  // ── GROUP G ──────────────────────────────────────────────
  { id:37, group:'G', date:'2026-06-15', dateDisplay:'Mon, Jun 15', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Belgium',      away:'Egypt',               venue:'Seattle'          },
  { id:38, group:'G', date:'2026-06-15', dateDisplay:'Mon, Jun 15', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'Iran',         away:'New Zealand',         venue:'Los Angeles'      },
  { id:39, group:'G', date:'2026-06-21', dateDisplay:'Sun, Jun 21', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Belgium',      away:'Iran',                venue:'Los Angeles'      },
  { id:40, group:'G', date:'2026-06-21', dateDisplay:'Sun, Jun 21', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'New Zealand',  away:'Egypt',               venue:'Vancouver'        },
  { id:41, group:'G', date:'2026-06-26', dateDisplay:'Fri, Jun 26', etTime:'11:00 PM', kwtTime:'6:00 AM+', home:'Egypt',        away:'Iran',                venue:'Seattle'          },
  { id:42, group:'G', date:'2026-06-26', dateDisplay:'Fri, Jun 26', etTime:'11:00 PM', kwtTime:'6:00 AM+', home:'New Zealand',  away:'Belgium',             venue:'Vancouver'        },

  // ── GROUP H ──────────────────────────────────────────────
  { id:43, group:'H', date:'2026-06-15', dateDisplay:'Mon, Jun 15', etTime:'12:00 PM', kwtTime:'7:00 PM',  home:'Spain',        away:'Cape Verde',          venue:'Atlanta'          },
  { id:44, group:'H', date:'2026-06-15', dateDisplay:'Mon, Jun 15', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Saudi Arabia', away:'Uruguay',             venue:'Miami'            },
  { id:45, group:'H', date:'2026-06-21', dateDisplay:'Sun, Jun 21', etTime:'12:00 PM', kwtTime:'7:00 PM',  home:'Spain',        away:'Saudi Arabia',        venue:'Atlanta'          },
  { id:46, group:'H', date:'2026-06-21', dateDisplay:'Sun, Jun 21', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Uruguay',      away:'Cape Verde',          venue:'Miami'            },
  { id:47, group:'H', date:'2026-06-26', dateDisplay:'Fri, Jun 26', etTime:'8:00 PM',  kwtTime:'3:00 AM+', home:'Cape Verde',   away:'Saudi Arabia',        venue:'Houston'          },
  { id:48, group:'H', date:'2026-06-26', dateDisplay:'Fri, Jun 26', etTime:'8:00 PM',  kwtTime:'3:00 AM+', home:'Uruguay',      away:'Spain',               venue:'Guadalajara'      },

  // ── GROUP I ──────────────────────────────────────────────
  { id:49, group:'I', date:'2026-06-16', dateDisplay:'Tue, Jun 16', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'France',       away:'Senegal',             venue:'New York/NJ'      },
  { id:50, group:'I', date:'2026-06-16', dateDisplay:'Tue, Jun 16', etTime:'6:00 PM',  kwtTime:'1:00 AM+', home:'Iraq',         away:'Norway',              venue:'Boston'           },
  { id:51, group:'I', date:'2026-06-22', dateDisplay:'Mon, Jun 22', etTime:'5:00 PM',  kwtTime:'12:00 AM+',home:'France',       away:'Iraq',                venue:'Philadelphia'     },
  { id:52, group:'I', date:'2026-06-22', dateDisplay:'Mon, Jun 22', etTime:'8:00 PM',  kwtTime:'3:00 AM+', home:'Norway',       away:'Senegal',             venue:'New York/NJ'      },
  { id:53, group:'I', date:'2026-06-26', dateDisplay:'Fri, Jun 26', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Norway',       away:'France',              venue:'Boston'           },
  { id:54, group:'I', date:'2026-06-26', dateDisplay:'Fri, Jun 26', etTime:'3:00 PM',  kwtTime:'10:00 PM', home:'Senegal',      away:'Iraq',                venue:'Toronto'          },

  // ── GROUP J ──────────────────────────────────────────────
  { id:55, group:'J', date:'2026-06-16', dateDisplay:'Tue, Jun 16', etTime:'9:00 PM',  kwtTime:'4:00 AM+', home:'Argentina',    away:'Algeria',             venue:'Kansas City'      },
  { id:56, group:'J', date:'2026-06-16', dateDisplay:'Tue, Jun 16', etTime:'12:00 AM', kwtTime:'7:00 AM',  home:'Austria',      away:'Jordan',              venue:'San Francisco'    },
  { id:57, group:'J', date:'2026-06-22', dateDisplay:'Mon, Jun 22', etTime:'1:00 PM',  kwtTime:'8:00 PM',  home:'Argentina',    away:'Austria',             venue:'Dallas'           },
  { id:58, group:'J', date:'2026-06-22', dateDisplay:'Mon, Jun 22', etTime:'11:00 PM', kwtTime:'6:00 AM+', home:'Jordan',       away:'Algeria',             venue:'San Francisco'    },
  { id:59, group:'J', date:'2026-06-27', dateDisplay:'Sat, Jun 27', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Algeria',      away:'Austria',             venue:'Kansas City'      },
  { id:60, group:'J', date:'2026-06-27', dateDisplay:'Sat, Jun 27', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Jordan',       away:'Argentina',           venue:'Dallas'           },

  // ── GROUP K ──────────────────────────────────────────────
  { id:61, group:'K', date:'2026-06-17', dateDisplay:'Wed, Jun 17', etTime:'1:00 PM',  kwtTime:'8:00 PM',  home:'Portugal',     away:'DR Congo',            venue:'Houston'          },
  { id:62, group:'K', date:'2026-06-17', dateDisplay:'Wed, Jun 17', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Uzbekistan',   away:'Colombia',            venue:'Mexico City'      },
  { id:63, group:'K', date:'2026-06-23', dateDisplay:'Tue, Jun 23', etTime:'1:00 PM',  kwtTime:'8:00 PM',  home:'Portugal',     away:'Uzbekistan',          venue:'Houston'          },
  { id:64, group:'K', date:'2026-06-23', dateDisplay:'Tue, Jun 23', etTime:'10:00 PM', kwtTime:'5:00 AM+', home:'Colombia',     away:'DR Congo',            venue:'Guadalajara'      },
  { id:65, group:'K', date:'2026-06-27', dateDisplay:'Sat, Jun 27', etTime:'7:30 PM',  kwtTime:'2:30 AM+', home:'Colombia',     away:'Portugal',            venue:'Miami'            },
  { id:66, group:'K', date:'2026-06-27', dateDisplay:'Sat, Jun 27', etTime:'7:30 PM',  kwtTime:'2:30 AM+', home:'DR Congo',     away:'Uzbekistan',          venue:'Atlanta'          },

  // ── GROUP L ──────────────────────────────────────────────
  { id:67, group:'L', date:'2026-06-17', dateDisplay:'Wed, Jun 17', etTime:'4:00 PM',  kwtTime:'11:00 PM', home:'England',      away:'Croatia',             venue:'Dallas'           },
  { id:68, group:'L', date:'2026-06-17', dateDisplay:'Wed, Jun 17', etTime:'7:00 PM',  kwtTime:'2:00 AM+', home:'Ghana',        away:'Panama',              venue:'Toronto'          },
  { id:69, group:'L', date:'2026-06-23', dateDisplay:'Tue, Jun 23', etTime:'4:00 PM',  kwtTime:'11:00 PM', home:'England',      away:'Ghana',               venue:'Boston'           },
  { id:70, group:'L', date:'2026-06-23', dateDisplay:'Tue, Jun 23', etTime:'7:00 PM',  kwtTime:'2:00 AM+', home:'Panama',       away:'Croatia',             venue:'Toronto'          },
  { id:71, group:'L', date:'2026-06-27', dateDisplay:'Sat, Jun 27', etTime:'5:00 PM',  kwtTime:'12:00 AM+',home:'Panama',       away:'England',             venue:'New York/NJ'      },
  { id:72, group:'L', date:'2026-06-27', dateDisplay:'Sat, Jun 27', etTime:'5:00 PM',  kwtTime:'12:00 AM+',home:'Croatia',      away:'Ghana',               venue:'Philadelphia'     },
];

// Times marked with + mean the next calendar day in Kuwait

// ============================================================
// APP STATE
// ============================================================
let state = {
  page: 'landing',
  userName: '',
  userDept: '',
  predictions: {},   // { matchId: { home: n, away: n } }
  actualScores: {},  // { matchId: { home: n, away: n, locked: bool } }
  leaderboard: [],
  adminLoggedIn: false,
};

// ============================================================
// NAVIGATION
// ============================================================
function navigate(pageName) {
  // If user tries to go to predictions without a name, send them to landing
  if (pageName === 'predictions' && !state.userName) {
    pageName = 'landing';
    showToast('Enter your name first to make predictions.', '');
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.navbar-links button').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + pageName);
  if (page) page.classList.add('active');

  const navBtn = document.querySelector(`[data-page="${pageName}"]`);
  if (navBtn) navBtn.classList.add('active');

  state.page = pageName;
  window.scrollTo(0, 0);

  if (pageName === 'leaderboard') loadLeaderboard();
  if (pageName === 'predictions' && state.userName) {
    // Re-render to show any locked matches that changed, then load scores
    renderPredictionPage();
    loadActualScores();
  }
}

// ============================================================
// LANDING PAGE
// ============================================================
function startPredictions() {
  const nameInput = document.getElementById('input-name');
  const deptInput = document.getElementById('input-dept');

  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('error');
    nameInput.focus();
    showToast('Please enter your name.', 'error');
    return;
  }
  nameInput.classList.remove('error');

  state.userName = name;
  state.userDept = deptInput.value.trim();

  document.getElementById('user-greeting').textContent = `Hi, ${name}! 👋`;
  renderPredictionPage();
  loadExistingPredictions(); // try to load saved predictions
  navigate('predictions');
}

// ============================================================
// PREDICTION PAGE — RENDER
// ============================================================
function renderPredictionPage() {
  const container = document.getElementById('matches-container');
  container.innerHTML = '';

  let currentDate = '';
  let currentGroup = '';

  MATCHES.forEach(match => {
    // Date divider
    if (match.date !== currentDate) {
      currentDate = match.date;
      const div = document.createElement('div');
      div.className = 'date-divider';
      div.textContent = `📅 ${match.dateDisplay}`;
      container.appendChild(div);
    }

    // Group header
    if (match.group !== currentGroup) {
      currentGroup = match.group;
      const gh = document.createElement('div');
      gh.className = 'section-header';
      gh.innerHTML = `<span class="group-badge">GROUP ${match.group}</span><h2>${getGroupTeams(match.group)}</h2>`;
      container.appendChild(gh);
    }

    // Match card
    const saved = state.predictions[match.id] || {};
    const actual = state.actualScores[match.id];
    const isLocked = actual && actual.locked;

    const card = document.createElement('div');
    card.className = 'match-card' + (isLocked ? ' locked' : '');
    card.id = `match-card-${match.id}`;

    const homeVal = saved.home !== undefined ? saved.home : '';
    const awayVal = saved.away !== undefined ? saved.away : '';

    let actualHtml = '';
    if (actual && actual.home !== null && actual.home !== undefined) {
      actualHtml = `<div class="actual-result">Actual: <span class="result-score">${actual.home} – ${actual.away}</span></div>`;
    }

    card.innerHTML = `
      <div class="match-meta">
        <span class="match-num">M${match.id}</span>
        <span class="time-tag">🕐 ${match.kwtTime} KWT</span>
        <span class="venue-tag">📍 ${match.venue}</span>
        ${isLocked ? '<span class="locked-tag">🔒 Locked</span>' : ''}
      </div>
      <div class="match-body">
        <div class="team">
          <span class="team-flag">${getFlag(match.home)}</span>
          <span class="team-name">${match.home}</span>
        </div>
        <div class="score-inputs">
          <input
            type="number" min="0" max="20" step="1"
            class="score-input"
            id="home-${match.id}"
            value="${homeVal}"
            placeholder="–"
            ${isLocked ? 'disabled' : ''}
            oninput="onScoreInput(this, ${match.id}, 'home')"
          />
          <span class="score-separator">:</span>
          <input
            type="number" min="0" max="20" step="1"
            class="score-input"
            id="away-${match.id}"
            value="${awayVal}"
            placeholder="–"
            ${isLocked ? 'disabled' : ''}
            oninput="onScoreInput(this, ${match.id}, 'away')"
          />
        </div>
        <div class="team">
          <span class="team-flag">${getFlag(match.away)}</span>
          <span class="team-name">${match.away}</span>
        </div>
      </div>
      ${actualHtml}
    `;

    container.appendChild(card);
  });

  updateFilledCount();
}

function getGroupTeams(group) {
  const teams = MATCHES.filter(m => m.group === group);
  const unique = [...new Set(teams.flatMap(m => [m.home, m.away]))];
  return unique.join(' · ');
}

function onScoreInput(input, matchId, side) {
  let val = input.value;
  // Enforce integer 0-20
  if (val === '' || val === null) {
    if (!state.predictions[matchId]) state.predictions[matchId] = {};
    delete state.predictions[matchId][side];
    if (!state.predictions[matchId].home && !state.predictions[matchId].away) {
      delete state.predictions[matchId];
    }
    updateFilledCount();
    return;
  }
  val = Math.round(Number(val));
  if (isNaN(val) || val < 0) val = 0;
  if (val > 20) val = 20;
  input.value = val;
  input.classList.remove('error');

  if (!state.predictions[matchId]) state.predictions[matchId] = {};
  state.predictions[matchId][side] = val;
  updateFilledCount();
}

function updateFilledCount() {
  let filled = 0;
  MATCHES.forEach(m => {
    const p = state.predictions[m.id];
    if (p && p.home !== undefined && p.away !== undefined) filled++;
  });
  const el = document.getElementById('filled-count');
  if (el) el.innerHTML = `Predictions filled: <strong>${filled}</strong> / ${MATCHES.length}`;
}

// ============================================================
// SUBMIT PREDICTIONS
// ============================================================
async function submitPredictions() {
  if (!state.userName) {
    showToast('No user name set. Go back to landing page.', 'error');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Saving…';

  try {
    const payload = {
      action: 'submitPredictions',
      name: state.userName,
      dept: state.userDept,
      predictions: state.predictions,
      timestamp: new Date().toISOString(),
    };

    const resp = await appsScriptCall(payload);

    if (resp.success) {
      document.getElementById('success-banner').classList.add('show');
      document.getElementById('success-banner').scrollIntoView({ behavior: 'smooth' });
      showToast('Predictions saved! 🎉', 'success');
    } else {
      showToast('Error: ' + (resp.error || 'Unknown error'), 'error');
    }
  } catch (e) {
    showToast('Connection error. Check your Apps Script URL.', 'error');
    console.error(e);
  }

  btn.disabled = false;
  btn.innerHTML = '💾 Save / Submit Predictions';
}

// ============================================================
// LOAD EXISTING PREDICTIONS (for returning users)
// ============================================================
async function loadExistingPredictions() {
  try {
    const resp = await appsScriptCall({
      action: 'getPredictions',
      name: state.userName,
    });
    if (resp.success && resp.predictions) {
      state.predictions = resp.predictions;
      // Refresh inputs
      MATCHES.forEach(m => {
        const p = resp.predictions[m.id];
        if (p) {
          const homeEl = document.getElementById(`home-${m.id}`);
          const awayEl = document.getElementById(`away-${m.id}`);
          if (homeEl && p.home !== undefined) homeEl.value = p.home;
          if (awayEl && p.away !== undefined) awayEl.value = p.away;
        }
      });
      updateFilledCount();
    }
  } catch (e) {
    console.log('Could not load existing predictions (first time user or offline).');
  }
}

// ============================================================
// LOAD ACTUAL SCORES (shown on prediction page)
// ============================================================
async function loadActualScores() {
  try {
    const resp = await appsScriptCall({ action: 'getScores' });
    if (resp.success && resp.scores) {
      state.actualScores = resp.scores;
      // Update locked state on cards
      MATCHES.forEach(m => {
        const card = document.getElementById(`match-card-${m.id}`);
        const actual = resp.scores[m.id];
        if (actual && actual.locked && card) {
          card.classList.add('locked');
          const inputs = card.querySelectorAll('input');
          inputs.forEach(inp => inp.disabled = true);
        }
      });
    }
  } catch (e) {
    console.log('Could not load scores (may not be deployed yet).');
  }
}

// ============================================================
// LEADERBOARD
// ============================================================
async function loadLeaderboard() {
  const tbody = document.getElementById('leaderboard-tbody');
  const noEntries = document.getElementById('no-entries');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray-400)">Loading… <span class="spinner" style="border-color:rgba(0,0,0,0.1);border-top-color:var(--green)"></span></td></tr>';

  try {
    const resp = await appsScriptCall({ action: 'getLeaderboard' });
    if (resp.success && resp.leaderboard) {
      renderLeaderboard(resp.leaderboard);
    } else {
      tbody.innerHTML = '';
      noEntries.style.display = 'block';
    }
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--red)">⚠️ Could not load leaderboard</td></tr>';
  }
}

function renderLeaderboard(data) {
  const tbody = document.getElementById('leaderboard-tbody');
  const noEntries = document.getElementById('no-entries');
  noEntries.style.display = 'none';

  if (!data || data.length === 0) {
    tbody.innerHTML = '';
    noEntries.style.display = 'block';
    return;
  }

  // Sort: total pts → exact scores → correct outcomes → earliest submission
  data.sort((a, b) => {
    if (b.totalPts !== a.totalPts) return b.totalPts - a.totalPts;
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores;
    if (b.correctOutcomes !== a.correctOutcomes) return b.correctOutcomes - a.correctOutcomes;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  tbody.innerHTML = data.map((row, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

    return `
      <tr>
        <td>
          <div class="rank-cell">
            ${medal ? `<span class="rank-medal">${medal}</span>` : `<span class="rank-num">${rank}</span>`}
          </div>
        </td>
        <td><strong>${escapeHtml(row.name)}</strong></td>
        <td>${row.dept ? `<span class="dept-tag">${escapeHtml(row.dept)}</span>` : '—'}</td>
        <td class="center"><span class="total-pts">${row.totalPts}</span></td>
        <td class="center">${row.exactScores}</td>
        <td class="center">${row.correctOutcomes}</td>
        <td class="center">${row.gdBonuses || 0}</td>
      </tr>
    `;
  }).join('');
}

// ============================================================
// ADMIN PAGE
// ============================================================
function adminLogin() {
  const pwInput = document.getElementById('admin-password');
  if (pwInput.value === ADMIN_PASSWORD) {
    state.adminLoggedIn = true;
    document.getElementById('admin-login-form').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    renderAdminPanel();
    loadAdminScores();
  } else {
    pwInput.classList.add('error');
    showToast('Incorrect password', 'error');
  }
}

function renderAdminPanel() {
  const container = document.getElementById('admin-matches');
  container.innerHTML = '';

  let currentDate = '';

  MATCHES.forEach(match => {
    if (match.date !== currentDate) {
      currentDate = match.date;
      const div = document.createElement('div');
      div.className = 'date-divider';
      div.textContent = `📅 ${match.dateDisplay}`;
      container.appendChild(div);
    }

    const card = document.createElement('div');
    card.className = 'admin-match-card';
    card.id = `admin-card-${match.id}`;

    card.innerHTML = `
      <div class="admin-match-info">
        <div class="match-teams">${match.home} vs ${match.away}</div>
        <div class="match-date-time">${match.dateDisplay} · ${match.kwtTime} KWT · ${match.venue} · Group ${match.group}</div>
      </div>
      <div class="admin-controls" id="admin-ctrl-${match.id}">
        <div class="admin-score-inputs">
          <input type="number" min="0" max="20" step="1"
            class="admin-score-input"
            id="admin-home-${match.id}"
            placeholder="0"
            title="${match.home} goals"
          />
          <span style="font-weight:700;color:var(--gray-400)">–</span>
          <input type="number" min="0" max="20" step="1"
            class="admin-score-input"
            id="admin-away-${match.id}"
            placeholder="0"
            title="${match.away} goals"
          />
        </div>
        <button class="btn btn-sm btn-primary" onclick="saveScore(${match.id})">Save</button>
        <button class="btn btn-sm btn-outline" onclick="toggleLock(${match.id})" id="lock-btn-${match.id}">🔒 Lock</button>
      </div>
    `;

    container.appendChild(card);
  });
}

async function loadAdminScores() {
  try {
    const resp = await appsScriptCall({ action: 'getScores' });
    if (resp.success && resp.scores) {
      state.actualScores = resp.scores;
      Object.entries(resp.scores).forEach(([matchId, score]) => {
        const homeEl = document.getElementById(`admin-home-${matchId}`);
        const awayEl = document.getElementById(`admin-away-${matchId}`);
        const lockBtn = document.getElementById(`lock-btn-${matchId}`);

        if (homeEl && score.home !== null && score.home !== undefined) homeEl.value = score.home;
        if (awayEl && score.away !== null && score.away !== undefined) awayEl.value = score.away;
        if (lockBtn) {
          if (score.locked) {
            lockBtn.textContent = '🔓 Unlock';
            lockBtn.classList.remove('btn-outline');
            lockBtn.classList.add('btn-danger', 'btn-sm');
          }
        }
        if (score.locked) {
          const homeElLock = document.getElementById(`admin-home-${matchId}`);
          const awayElLock = document.getElementById(`admin-away-${matchId}`);
          if (homeElLock) homeElLock.disabled = true;
          if (awayElLock) awayElLock.disabled = true;
        }
      });
    }
  } catch (e) {
    console.log('Admin: could not load scores.');
  }
}

async function saveScore(matchId) {
  const homeEl = document.getElementById(`admin-home-${matchId}`);
  const awayEl = document.getElementById(`admin-away-${matchId}`);

  const home = parseInt(homeEl.value, 10);
  const away = parseInt(awayEl.value, 10);

  if (isNaN(home) || isNaN(away) || home < 0 || away < 0 || home > 20 || away > 20) {
    showToast('Enter valid scores (0–20).', 'error');
    return;
  }

  try {
    const resp = await appsScriptCall({
      action: 'updateScore',
      matchId,
      home,
      away,
      adminPw: ADMIN_PASSWORD,
    });
    if (resp.success) {
      showToast(`M${matchId} score saved: ${home}–${away} ✅`, 'success');
      if (!state.actualScores[matchId]) state.actualScores[matchId] = {};
      state.actualScores[matchId].home = home;
      state.actualScores[matchId].away = away;
    } else {
      showToast('Error: ' + resp.error, 'error');
    }
  } catch (e) {
    showToast('Connection error.', 'error');
  }
}

async function toggleLock(matchId) {
  const lockBtn = document.getElementById(`lock-btn-${matchId}`);
  const isLocked = state.actualScores[matchId] && state.actualScores[matchId].locked;
  const newLocked = !isLocked;

  try {
    const resp = await appsScriptCall({
      action: 'setLock',
      matchId,
      locked: newLocked,
      adminPw: ADMIN_PASSWORD,
    });

    if (resp.success) {
      if (!state.actualScores[matchId]) state.actualScores[matchId] = {};
      state.actualScores[matchId].locked = newLocked;

      lockBtn.textContent = newLocked ? '🔓 Unlock' : '🔒 Lock';
      if (newLocked) {
        lockBtn.classList.remove('btn-outline');
        lockBtn.classList.add('btn-danger');
        document.getElementById(`admin-home-${matchId}`).disabled = true;
        document.getElementById(`admin-away-${matchId}`).disabled = true;
      } else {
        lockBtn.classList.add('btn-outline');
        lockBtn.classList.remove('btn-danger');
        document.getElementById(`admin-home-${matchId}`).disabled = false;
        document.getElementById(`admin-away-${matchId}`).disabled = false;
      }

      showToast(`M${matchId} ${newLocked ? 'locked 🔒' : 'unlocked 🔓'}`, 'success');
    } else {
      showToast('Error: ' + resp.error, 'error');
    }
  } catch (e) {
    showToast('Connection error.', 'error');
  }
}

// ============================================================
// GOOGLE APPS SCRIPT API CALL
// ── Uses GET requests to avoid CORS issues with Apps Script ──
// ============================================================
async function appsScriptCall(payload) {
  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    // Demo mode — no URL set yet
    console.warn('⚠️  No Apps Script URL set — running in demo mode.');
    if (payload.action === 'getLeaderboard') return { success: true, leaderboard: [] };
    if (payload.action === 'getScores')      return { success: true, scores: {} };
    if (payload.action === 'getPredictions') return { success: true, predictions: null };
    return { success: true };
  }

  // Encode entire payload as a URL parameter (GET avoids CORS preflight issues)
  const url = APPS_SCRIPT_URL + '?payload=' + encodeURIComponent(JSON.stringify(payload));

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error('HTTP ' + response.status);

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Bad response from Apps Script: ' + text.substring(0, 200));
  }
}

// ============================================================
// TEST CONNECTION (called from Admin page)
// ============================================================
async function testConnection() {
  const btn = document.getElementById('test-conn-btn');
  const out = document.getElementById('test-conn-result');
  btn.disabled = true;
  btn.textContent = 'Testing…';
  out.style.display = 'none';

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    out.style.cssText = 'display:block;padding:0.75rem;border-radius:8px;background:#fff3cd;color:#856404;margin-top:0.75rem;font-size:0.85rem';
    out.innerHTML = '⚠️ <strong>No URL set.</strong> Open script.js and replace <code>YOUR_APPS_SCRIPT_URL_HERE</code> with your Apps Script Web App URL.';
    btn.disabled = false;
    btn.textContent = '🔌 Test Connection';
    return;
  }

  try {
    const resp = await appsScriptCall({ action: 'ping' });
    if (resp.success) {
      out.style.cssText = 'display:block;padding:0.75rem;border-radius:8px;background:#d4edda;color:#155724;margin-top:0.75rem;font-size:0.85rem';
      out.innerHTML = '✅ <strong>Connection successful!</strong> Your Apps Script is working correctly.';
    } else {
      throw new Error(resp.error || 'Unknown error');
    }
  } catch (e) {
    out.style.cssText = 'display:block;padding:0.75rem;border-radius:8px;background:#f8d7da;color:#721c24;margin-top:0.75rem;font-size:0.85rem';
    out.innerHTML = `❌ <strong>Connection failed.</strong><br>Error: ${e.message}<br><br>
      <strong>Check:</strong><br>
      1. Is the URL in script.js correct? (must end in <code>/exec</code>)<br>
      2. Did you deploy with <em>Anyone</em> access?<br>
      3. Did you authorise the script when prompted?`;
  }

  btn.disabled = false;
  btn.textContent = '🔌 Test Connection';
}

// Panel version of test connection (for inside admin panel)
async function testConnectionPanel() {
  const btn = document.getElementById('test-conn-btn-panel');
  const out = document.getElementById('test-conn-result-panel');
  btn.disabled = true;
  btn.textContent = 'Testing…';
  out.style.display = 'none';

  if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    out.style.cssText = 'display:block;padding:0.75rem;border-radius:8px;background:#fff3cd;color:#856404;font-size:0.85rem';
    out.innerHTML = '⚠️ <strong>No URL set.</strong> Open script.js and replace <code>YOUR_APPS_SCRIPT_URL_HERE</code> with your Apps Script Web App URL.';
    btn.disabled = false; btn.textContent = '🔌 Test Connection';
    return;
  }

  try {
    const resp = await appsScriptCall({ action: 'ping' });
    if (resp.success) {
      out.style.cssText = 'display:block;padding:0.75rem;border-radius:8px;background:#d4edda;color:#155724;font-size:0.85rem';
      out.innerHTML = '✅ <strong>Connected!</strong> Apps Script is responding correctly.';
    } else throw new Error(resp.error || 'Unknown error');
  } catch (e) {
    out.style.cssText = 'display:block;padding:0.75rem;border-radius:8px;background:#f8d7da;color:#721c24;font-size:0.85rem';
    out.innerHTML = `❌ <strong>Failed:</strong> ${e.message}<br>Check URL ends in <code>/exec</code> and access is set to <em>Anyone</em>.`;
  }

  btn.disabled = false; btn.textContent = '🔌 Test Connection';
}

// ============================================================
// UTILITIES
// ============================================================
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 3500);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Country → flag emoji lookup
const FLAGS = {
  'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czechia':'🇨🇿',
  'Canada':'🇨🇦','Bosnia & Herzegovina':'🇧🇦','Qatar':'🇶🇦','Switzerland':'🇨🇭',
  'Brazil':'🇧🇷','Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA':'🇺🇸','Paraguay':'🇵🇾','Australia':'🇦🇺','Türkiye':'🇹🇷',
  'Germany':'🇩🇪','Curaçao':'🇨🇼','Ivory Coast':'🇨🇮','Ecuador':'🇪🇨',
  'Netherlands':'🇳🇱','Japan':'🇯🇵','Sweden':'🇸🇪','Tunisia':'🇹🇳',
  'Belgium':'🇧🇪','Egypt':'🇪🇬','Iran':'🇮🇷','New Zealand':'🇳🇿',
  'Spain':'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦','Uruguay':'🇺🇾',
  'France':'🇫🇷','Senegal':'🇸🇳','Iraq':'🇮🇶','Norway':'🇳🇴',
  'Argentina':'🇦🇷','Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴',
  'Portugal':'🇵🇹','DR Congo':'🇨🇩','Uzbekistan':'🇺🇿','Colombia':'🇨🇴',
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatia':'🇭🇷','Ghana':'🇬🇭','Panama':'🇵🇦',
};

function getFlag(team) {
  return FLAGS[team] || '🏳️';
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  navigate('landing');
});
