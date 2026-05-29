/* ============================================================
   IgorOS — Design System CSS
   Dark Premium · Minimalista · Apple-level
   ============================================================ */

:root {
  --bg:        #0a0a0b;
  --bg2:       #111113;
  --bg3:       #1a1a1e;
  --surface:   #1c1c21;
  --surface2:  #242429;
  --border:    rgba(255,255,255,0.07);
  --border2:   rgba(255,255,255,0.13);
  --text:      #f0eff4;
  --text2:     #9b9aa3;
  --text3:     #5a5966;
  --blue:      #3b82f6;
  --blue2:     #1d4ed8;
  --green:     #22c55e;
  --amber:     #f59e0b;
  --red:       #ef4444;
  --purple:    #a78bfa;
  --cyan:      #06b6d4;
  --pink:      #ec4899;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --shadow:    0 4px 24px rgba(0,0,0,0.4);
  --font:      'Inter', -apple-system, sans-serif;
  --sidebar-w: 240px;
  --topbar-h:  60px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 15px; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: var(--font); border: none; background: none; }
input, textarea, select {
  font-family: var(--font);
  background: var(--bg2);
  border: 1px solid var(--border2);
  color: var(--text);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: 14px;
  width: 100%;
  outline: none;
  transition: border-color .15s;
}
input:focus, textarea:focus, select:focus { border-color: var(--blue); }
select option { background: var(--bg2); }
textarea { resize: vertical; min-height: 80px; }
.hidden { display: none !important; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

/* ════════════════════════════════════════════
   AUTH
   ════════════════════════════════════════════ */
.auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 0%, rgba(59,130,246,.12) 0%, transparent 60%), var(--bg);
}

.auth-card {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--radius-xl);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: var(--shadow);
}

.auth-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.auth-title { font-size: 22px; font-weight: 700; letter-spacing: -.4px; }
.auth-sub   { font-size: 12px; color: var(--text3); }

.logo-mark {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, var(--blue2), var(--blue));
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; color: #fff;
  box-shadow: 0 0 24px rgba(59,130,246,.35);
  flex-shrink: 0;
}
.logo-mark.sm { width: 34px; height: 34px; font-size: 13px; border-radius: 10px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; }

.btn-primary {
  background: var(--blue);
  color: #fff;
  padding: 12px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  transition: opacity .15s, transform .1s;
}
.btn-primary:hover { opacity: .88; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  background: transparent;
  color: var(--text3);
  padding: 10px;
  border-radius: var(--radius-md);
  font-size: 14px;
  transition: color .15s;
  border: 1px solid var(--border);
}
.btn-ghost:hover { color: var(--text2); border-color: var(--border2); }

.auth-error {
  background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.25);
  color: var(--red);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 13px;
}

/* ════════════════════════════════════════════
   APP LAYOUT
   ════════════════════════════════════════════ */
.app { display: flex; min-height: 100vh; }

/* ── SIDEBAR ── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  transition: transform .25s cubic-bezier(.4,0,.2,1);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  border-bottom: 1px solid var(--border);
}
.logo-text { font-size: 16px; font-weight: 700; letter-spacing: -.3px; flex: 1; }
.sidebar-close { display: none; color: var(--text3); font-size: 16px; padding: 4px; }

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  color: var(--text3);
  transition: all .15s;
}
.nav-item:hover { color: var(--text2); background: var(--surface); }
.nav-item.active { color: var(--text); background: var(--surface2); }
.nav-item.active .nav-icon { filter: none; }
.nav-icon { font-size: 16px; width: 24px; text-align: center; }

.sidebar-footer {
  padding: 16px 14px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: var(--text3);
}
.sync-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--green);
  animation: pulse 2s infinite;
}
.sync-dot.syncing { background: var(--amber); animation: spin 1s linear infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.btn-logout {
  font-size: 13px;
  color: var(--text3);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  text-align: left;
  transition: color .15s, background .15s;
}
.btn-logout:hover { color: var(--red); background: rgba(239,68,68,.08); }

/* ── TOPBAR ── */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  height: var(--topbar-h);
  background: var(--bg2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.hamburger {
  display: none;
  color: var(--text2);
  font-size: 20px;
  padding: 4px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.topbar-actions { display: flex; align-items: center; gap: 10px; }

.btn-icon {
  width: 34px; height: 34px;
  border-radius: var(--radius-md);
  background: var(--blue);
  color: #fff;
  font-size: 20px;
  display: flex; align-items: center; justify-content: center;
  transition: opacity .15s;
}
.btn-icon:hover { opacity: .85; }

.user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--blue);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.page-content { flex: 1; padding: 28px 28px 60px; overflow-y: auto; }

/* ════════════════════════════════════════════
   CARDS & COMPONENTS
   ════════════════════════════════════════════ */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
}
.card:hover { border-color: var(--border2); }

.card-sm { padding: 14px 16px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .8px;
}
.section-action {
  font-size: 12px;
  color: var(--blue);
  font-weight: 500;
  background: none;
  border: none;
}
.section-action:hover { text-decoration: underline; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;
}
.badge-blue   { color: var(--blue);   background: rgba(59,130,246,.1);  border-color: rgba(59,130,246,.2); }
.badge-green  { color: var(--green);  background: rgba(34,197,94,.1);   border-color: rgba(34,197,94,.2); }
.badge-amber  { color: var(--amber);  background: rgba(245,158,11,.1);  border-color: rgba(245,158,11,.2); }
.badge-red    { color: var(--red);    background: rgba(239,68,68,.1);   border-color: rgba(239,68,68,.2); }
.badge-purple { color: var(--purple); background: rgba(167,139,250,.1); border-color: rgba(167,139,250,.2); }
.badge-gray   { color: var(--text3);  background: rgba(255,255,255,.05); border-color: var(--border); }

.metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px;
}
.metric-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .6px;
  margin-bottom: 6px;
}
.metric-value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -.5px;
  line-height: 1;
}
.metric-sub {
  font-size: 12px;
  color: var(--text3);
  margin-top: 6px;
}
.metric-trend-up   { color: var(--green); font-size: 12px; margin-top: 4px; }
.metric-trend-down { color: var(--red);   font-size: 12px; margin-top: 4px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

/* ── TABLE ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--text3);
  text-transform: uppercase;
  letter-spacing: .6px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
}
td {
  padding: 12px 14px;
  font-size: 13px;
  color: var(--text2);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background: var(--bg3); }

/* ── PROGRESS BAR ── */
.progress-bar {
  height: 5px;
  background: rgba(255,255,255,.07);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--blue);
  transition: width .5s cubic-bezier(.4,0,.2,1);
}

/* ── EMPTY STATE ── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text3);
}
.empty-state .empty-icon { font-size: 48px; margin-bottom: 14px; opacity: .5; }
.empty-state h3 { font-size: 16px; color: var(--text2); margin-bottom: 6px; }
.empty-state p  { font-size: 13px; }
.empty-state button { margin-top: 18px; }

/* ── BUTTONS ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  transition: all .15s;
  border: none;
  cursor: pointer;
}
.btn-blue   { background: var(--blue); color: #fff; }
.btn-blue:hover { background: var(--blue2); }
.btn-outline {
  background: transparent;
  color: var(--text2);
  border: 1px solid var(--border2);
}
.btn-outline:hover { border-color: var(--blue); color: var(--blue); }
.btn-danger { background: rgba(239,68,68,.12); color: var(--red); border: 1px solid rgba(239,68,68,.2); }
.btn-danger:hover { background: rgba(239,68,68,.2); }
.btn-sm { padding: 6px 12px; font-size: 12px; }

/* ── FORM ── */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-full { grid-column: 1 / -1; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .4px; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
  animation: modal-in .2s cubic-bezier(.4,0,.2,1);
}
@keyframes modal-in { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:none} }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid var(--border);
}
.modal-header h2 { font-size: 16px; font-weight: 700; }
.modal-close {
  color: var(--text3);
  font-size: 18px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background .15s;
}
.modal-close:hover { background: var(--bg3); color: var(--text); }

.modal-body {
  padding: 20px 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-footer {
  padding: 14px 22px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* ── TOAST ── */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--surface2);
  border: 1px solid var(--border2);
  color: var(--text);
  padding: 12px 20px;
  border-radius: var(--radius-lg);
  font-size: 13px;
  font-weight: 500;
  z-index: 2000;
  box-shadow: var(--shadow);
  animation: toast-in .2s ease;
}
@keyframes toast-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

/* ── KANBAN ── */
.kanban-board {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 16px;
  align-items: flex-start;
}
.kanban-col {
  min-width: 240px;
  background: var(--bg2);
  border-radius: var(--radius-lg);
  padding: 14px;
  flex-shrink: 0;
}
.kanban-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.kanban-col-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text2);
}
.kanban-dot { width: 8px; height: 8px; border-radius: 50%; }
.kanban-count {
  background: var(--bg3);
  color: var(--text3);
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 20px;
}
.kanban-cards { display: flex; flex-direction: column; gap: 8px; min-height: 60px; }
.kanban-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px;
  cursor: pointer;
  transition: all .15s;
}
.kanban-card:hover { border-color: var(--border2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.3); }
.kanban-card-title { font-size: 13px; font-weight: 500; margin-bottom: 8px; line-height: 1.4; }
.kanban-card-meta  { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; }

/* ── PIPELINE ── */
.pipeline-board { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 12px; }
.pipeline-col {
  min-width: 180px;
  background: var(--bg2);
  border-radius: var(--radius-lg);
  padding: 12px;
  flex-shrink: 0;
}

/* ── TABS ── */
.tabs {
  display: flex;
  gap: 0;
  background: var(--bg2);
  border-radius: var(--radius-md);
  padding: 4px;
  margin-bottom: 20px;
}
.tab-btn {
  flex: 1;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  color: var(--text3);
  transition: all .15s;
  text-align: center;
}
.tab-btn.active { background: var(--surface2); color: var(--text); }
.tab-btn:hover:not(.active) { color: var(--text2); }
.tab-pane { display: none; }
.tab-pane.active { display: block; }

/* ── SEARCH ── */
.search-bar {
  position: relative;
  margin-bottom: 18px;
}
.search-bar input {
  padding-left: 36px;
}
.search-bar::before {
  content: '🔍';
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  pointer-events: none;
}

/* ── GOAL CARD ── */
.goal-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px;
}
.goal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.goal-percent { font-size: 28px; font-weight: 700; }
.goal-streak  { font-size: 12px; color: var(--amber); margin-top: 8px; }

/* ── NOTE CARD ── */
.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
.note-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  cursor: pointer;
  transition: all .15s;
  min-height: 130px;
  display: flex;
  flex-direction: column;
}
.note-card:hover { border-color: var(--border2); transform: translateY(-1px); }
.note-card-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; line-height: 1.4; }
.note-card-body  { font-size: 12px; color: var(--text3); line-height: 1.6; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; }
.note-card-date  { font-size: 11px; color: var(--text3); margin-top: 10px; }

/* ── TASK ROW ── */
.task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background .1s;
}
.task-row:last-child { border-bottom: none; }
.task-row:hover { background: rgba(255,255,255,.02); margin: 0 -8px; padding: 11px 8px; border-radius: var(--radius-sm); }
.task-check {
  width: 22px; height: 22px;
  border: 1.5px solid var(--border2);
  border-radius: 50%;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
  font-size: 11px;
}
.task-check:hover { border-color: var(--blue); }
.task-check.done  { background: var(--green); border-color: var(--green); color: #fff; }
.task-title { flex: 1; font-size: 14px; }
.task-title.done { text-decoration: line-through; color: var(--text3); }
.task-due { font-size: 11px; color: var(--text3); white-space: nowrap; }
.task-due.overdue { color: var(--red); }

/* ── EVENT ── */
.event-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.event-row:last-child { border-bottom: none; }
.event-bar { width: 3px; align-self: stretch; border-radius: 3px; flex-shrink: 0; }
.event-time { font-size: 12px; color: var(--text3); white-space: nowrap; min-width: 70px; }
.event-title { font-size: 14px; font-weight: 500; }
.event-loc   { font-size: 12px; color: var(--text3); margin-top: 2px; }

/* ── CAL MONTH ── */
.cal-month { user-select: none; }
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.cal-nav { color: var(--text2); font-size: 18px; padding: 4px 10px; border-radius: var(--radius-sm); }
.cal-nav:hover { background: var(--bg3); }
.cal-month-title { font-size: 16px; font-weight: 700; }
.cal-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
}
.cal-days-header span { font-size: 11px; color: var(--text3); font-weight: 600; padding: 4px 0; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  gap: 2px;
  transition: background .1s;
}
.cal-day:hover { background: var(--bg3); }
.cal-day.today .day-num { background: var(--blue); color: #fff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; }
.cal-day.other-month .day-num { color: var(--text3); opacity: .4; }
.cal-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--blue); }

/* ── FINANCE ── */
.finance-bar {
  height: 6px;
  background: var(--bg3);
  border-radius: 3px;
  overflow: hidden;
  margin: 10px 0;
}
.finance-bar-income { height: 100%; border-radius: 3px; background: var(--green); transition: width .5s; }

/* ════════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════════ */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0,0,0,.5);
  }
  .sidebar-close { display: flex; }
  .hamburger    { display: flex; }
  .main-content { margin-left: 0; }
  .page-content { padding: 18px 16px 80px; }
  .grid-4 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .kanban-board { padding-bottom: 80px; }
}

@media (max-width: 480px) {
  .grid-4 { grid-template-columns: 1fr; }
  .metric-value { font-size: 22px; }
}
