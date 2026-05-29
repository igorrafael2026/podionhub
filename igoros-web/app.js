// ============================================================
// IgorOS — App Core · Navigation · UI Helpers
// ============================================================

// ── Navigation ───────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: '⚡ Dashboard',
  agenda:    '📅 Agenda',
  tasks:     '✅ Tarefas',
  finance:   '💰 Financeiro',
  projects:  '🎬 Projetos',
  clients:   '👥 Clientes',
  goals:     '🎯 Metas',
  notes:     '📝 Notas'
}

async function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page)
  })
  document.getElementById('page-title').textContent = PAGE_TITLES[page] || page
  const content = document.getElementById('page-content')
  content.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><p>Carregando...</p></div>'
  if (window.innerWidth < 769) closeSidebar()

  try {
    switch (page) {
      case 'dashboard': await renderDashboard(); break
      case 'agenda':    await renderAgenda();    break
      case 'tasks':     await renderTasks();     break
      case 'finance':   await renderFinance();   break
      case 'projects':  await renderProjects();  break
      case 'clients':   await renderClients();   break
      case 'goals':     await renderGoals();     break
      case 'notes':     await renderNotes();     break
    }
  } catch(e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Erro ao carregar: ${e.message}</p></div>`
    console.error(e)
  }
}

// ── Sidebar ───────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open')
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open')
}

// ── Modal ────────────────────────────────────────────────
function openModal(title, bodyHTML, onConfirm) {
  document.getElementById('modal-title').textContent = title
  document.getElementById('modal-body').innerHTML = bodyHTML
  document.getElementById('modal-overlay').classList.remove('hidden')
  if (onConfirm) {
    const footer = document.createElement('div')
    footer.className = 'modal-footer'
    footer.innerHTML = `
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-blue" id="modal-confirm">Salvar</button>`
    document.getElementById('modal').appendChild(footer)
    document.getElementById('modal-confirm').onclick = onConfirm
  }
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return
  document.getElementById('modal-overlay').classList.add('hidden')
  const footer = document.querySelector('.modal-footer')
  if (footer) footer.remove()
}

// ── Toast ─────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast')
  const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' }
  t.textContent = msg
  t.style.borderLeftColor = colors[type] || colors.info
  t.style.borderLeft = `3px solid ${colors[type]}`
  t.classList.remove('hidden')
  clearTimeout(t._timer)
  t._timer = setTimeout(() => t.classList.add('hidden'), 3000)
}

// ── Quick Add ─────────────────────────────────────────────
function openQuickAdd() {
  openModal('Entrada Rápida',
    `<div class="field-group">
       <label class="field-label">Adicionar tarefa rápida</label>
       <input type="text" id="qa-title" placeholder="O que precisa ser feito?" autofocus/>
     </div>
     <div class="form-row">
       <div class="field-group">
         <label class="field-label">Prioridade</label>
         <select id="qa-priority">
           <option value="medium">Média</option>
           <option value="low">Baixa</option>
           <option value="high">Alta</option>
           <option value="urgent">Urgente</option>
         </select>
       </div>
       <div class="field-group">
         <label class="field-label">Prazo</label>
         <input type="date" id="qa-due"/>
       </div>
     </div>`,
    async () => {
      const title = document.getElementById('qa-title').value.trim()
      if (!title) return showToast('Digite o título', 'error')
      await DB.insert('tasks', {
        user_id:  AuthManager.userId(),
        title,
        status:   'inbox',
        priority: document.getElementById('qa-priority').value,
        due_date: document.getElementById('qa-due').value || null
      })
      closeModal()
      showToast('Tarefa criada!')
      navigate('tasks')
    }
  )
  setTimeout(() => document.getElementById('qa-title')?.focus(), 100)
}

// ── Sync indicator ────────────────────────────────────────
function setSyncing(active) {
  const dot   = document.querySelector('.sync-dot')
  const label = document.getElementById('sync-label')
  if (!dot) return
  if (active) {
    dot.classList.add('syncing')
    label.textContent = 'Sincronizando...'
  } else {
    dot.classList.remove('syncing')
    label.textContent = 'Sincronizado'
  }
}

// ── Shared render helpers ─────────────────────────────────
function badge(text, cls) {
  return `<span class="badge ${cls}">${text}</span>`
}
function taskBadge(status) {
  const s = TASK_STATUS[status] || TASK_STATUS.inbox
  return badge(s.label, s.badge)
}
function priorityBadge(p) {
  const s = TASK_PRIORITY[p] || TASK_PRIORITY.medium
  return badge(s.label, s.badge)
}
function projectBadge(status) {
  const s = PROJECT_STATUS[status] || PROJECT_STATUS.briefing
  return badge(s.label, s.badge)
}
function pipelineBadge(stage) {
  const s = PIPELINE_STAGE[stage] || PIPELINE_STAGE.lead
  return badge(s.label, s.badge)
}

// ── Dashboard ─────────────────────────────────────────────
async function renderDashboard() {
  setSyncing(true)
  const uid = AuthManager.userId()
  const today = today_iso()
  const mStart = month_start()
  const mEnd   = month_end()

  const [tasks, events, projects, transactions] = await Promise.all([
    db.from('tasks').select('*').eq('user_id', uid).eq('is_deleted', false).in('status', ['inbox','todo','in_progress','waiting']).lte('due_date', today).order('due_date'),
    db.from('events').select('*').eq('user_id', uid).eq('is_deleted', false).gte('start_at', new Date().toISOString()).order('start_at').limit(5),
    db.from('projects').select('*').eq('user_id', uid).eq('is_deleted', false).eq('is_archived', false).neq('status','delivered').neq('status','archived').order('updated_at', { ascending: false }).limit(5),
    db.from('transactions').select('*').eq('user_id', uid).eq('is_deleted', false).gte('due_date', mStart).lte('due_date', mEnd)
  ])

  const txns     = transactions.data || []
  const income   = txns.filter(t => t.type === 'income').reduce((s,t) => s+Number(t.amount), 0)
  const expense  = txns.filter(t => t.type === 'expense').reduce((s,t) => s+Number(t.amount), 0)
  const balance  = income - expense
  const pending  = (tasks.data || []).length
  const overdue  = (tasks.data || []).filter(t => t.due_date && t.due_date < today).length
  const totalBar = income + expense || 1
  setSyncing(false)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const phrases = [
    'Foco é a arte de saber o que ignorar.',
    'Execute com a velocidade de quem acredita.',
    'A disciplina de hoje é a liberdade de amanhã.',
    'Clareza é o combustível da execução.',
    'Produza mais do que consome. Entregue mais do que promete.'
  ]
  const phrase = phrases[Math.floor(Math.random() * phrases.length)]

  document.getElementById('page-content').innerHTML = `
    <div style="margin-bottom:28px">
      <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:4px">
        ${now.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}
      </div>
      <div style="font-size:30px;font-weight:800;letter-spacing:-.5px">${greeting}, Igor 👋</div>
      <div style="font-size:14px;color:var(--text3);margin-top:6px;font-style:italic">${phrase}</div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        ${pending ? `<span class="badge badge-blue">${pending} tarefas pendentes</span>` : ''}
        ${overdue ? `<span class="badge badge-red">${overdue} atrasadas</span>` : ''}
        ${(events.data||[]).length ? `<span class="badge badge-purple">${events.data.length} próximos eventos</span>` : ''}
      </div>
    </div>

    <!-- Métricas financeiras -->
    <div class="section-header"><span class="section-label">Este Mês</span></div>
    <div class="grid-4" style="margin-bottom:28px">
      <div class="metric-card">
        <div class="metric-label">Saldo</div>
        <div class="metric-value" style="color:${balance>=0?'var(--green)':'var(--red)'}">${fmt_currency(balance)}</div>
        <div class="finance-bar"><div class="finance-bar-income" style="width:${Math.round((income/totalBar)*100)}%"></div></div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Receitas</div>
        <div class="metric-value" style="color:var(--green)">${fmt_currency(income)}</div>
        <div class="metric-sub">↑ entradas</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Despesas</div>
        <div class="metric-value" style="color:var(--red)">${fmt_currency(expense)}</div>
        <div class="metric-sub">↓ saídas</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Tarefas</div>
        <div class="metric-value">${pending}</div>
        <div class="metric-sub">${overdue} atrasadas</div>
      </div>
    </div>

    <!-- Tarefas do dia -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px" class="dash-cols">
      <div>
        <div class="section-header">
          <span class="section-label">Tarefas do Dia</span>
          <button class="section-action" onclick="navigate('tasks')">Ver todas</button>
        </div>
        <div class="card" style="padding:0">
          ${(tasks.data||[]).length === 0
            ? `<div class="empty-state" style="padding:30px"><div class="empty-icon">✅</div><p>Tudo em dia!</p></div>`
            : (tasks.data||[]).slice(0,6).map(t => `
              <div class="task-row" style="padding:10px 16px" onclick="openTaskDetail('${t.id}')">
                <div class="task-check ${t.status==='done'?'done':''}" onclick="toggleTask(event,'${t.id}','${t.status}')">
                  ${t.status==='done'?'✓':''}
                </div>
                <span class="task-title ${t.status==='done'?'done':''}">${t.title}</span>
                <span class="task-due ${t.due_date && t.due_date < today ? 'overdue':''}">${t.due_date ? fmt_relative(t.due_date) : ''}</span>
              </div>`).join('')
          }
        </div>
      </div>

      <!-- Próximos eventos -->
      <div>
        <div class="section-header">
          <span class="section-label">Próximos Eventos</span>
          <button class="section-action" onclick="navigate('agenda')">Agenda</button>
        </div>
        <div class="card" style="padding:12px 16px">
          ${(events.data||[]).length === 0
            ? `<div class="empty-state" style="padding:20px"><p>Nenhum evento próximo</p></div>`
            : (events.data||[]).map(ev => {
                const cat = EVENT_CATEGORY[ev.category] || EVENT_CATEGORY.other
                return `<div class="event-row">
                  <div class="event-bar" style="background:${cat.color}"></div>
                  <div>
                    <div class="event-time">${new Date(ev.start_at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</div>
                    <div class="event-title">${ev.title}</div>
                    ${ev.location ? `<div class="event-loc">📍 ${ev.location}</div>` : ''}
                  </div>
                </div>`}).join('')
          }
        </div>
      </div>
    </div>

    <!-- Projetos ativos -->
    <div class="section-header">
      <span class="section-label">Projetos Ativos</span>
      <button class="section-action" onclick="navigate('projects')">Ver todos</button>
    </div>
    <div class="grid-3" style="margin-bottom:28px">
      ${(projects.data||[]).length === 0
        ? `<div class="card"><div class="empty-state" style="padding:20px"><p>Nenhum projeto ativo</p></div></div>`
        : (projects.data||[]).map(p => `
          <div class="card card-sm" onclick="navigate('projects')" style="cursor:pointer">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
              <div style="width:10px;height:10px;border-radius:50%;background:${p.color||'#3b82f6'};flex-shrink:0"></div>
              <span style="font-weight:600;font-size:14px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              ${projectBadge(p.status)}
              ${p.delivery_date ? `<span style="font-size:11px;color:var(--text3)">${fmt_date(p.delivery_date)}</span>` : ''}
            </div>
          </div>`).join('')
      }
    </div>
  `
  // Fix responsive
  if (window.innerWidth < 769) {
    document.querySelector('.dash-cols').style.gridTemplateColumns = '1fr'
  }
}

// ── Tasks ─────────────────────────────────────────────────
async function renderTasks() {
  const uid = AuthManager.userId()
  const { data: tasks } = await db.from('tasks').select('*').eq('user_id', uid).eq('is_deleted', false).order('created_at', { ascending: false })
  const all = tasks || []

  const statusGroups = {
    inbox:       all.filter(t => t.status === 'inbox'),
    todo:        all.filter(t => t.status === 'todo'),
    in_progress: all.filter(t => t.status === 'in_progress'),
    waiting:     all.filter(t => t.status === 'waiting'),
    done:        all.filter(t => t.status === 'done'),
  }

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Tarefas</div>
        <div style="font-size:26px;font-weight:800">${all.filter(t=>t.status!=='done'&&t.status!=='cancelled').length} pendentes</div>
      </div>
      <button class="btn btn-blue" onclick="openAddTask()">＋ Nova Tarefa</button>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab(this,'tab-kanban')">Kanban</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-list')">Lista</button>
    </div>

    <!-- KANBAN -->
    <div id="tab-kanban" class="tab-pane active">
      <div class="kanban-board">
        ${Object.entries(statusGroups).map(([status, items]) => {
          const s = TASK_STATUS[status]
          return `
          <div class="kanban-col">
            <div class="kanban-col-header">
              <div class="kanban-col-title">
                <div class="kanban-dot" style="background:${s.color}"></div>
                ${s.label}
              </div>
              <span class="kanban-count">${items.length}</span>
            </div>
            <div class="kanban-cards">
              ${items.length === 0
                ? `<div style="text-align:center;padding:20px;font-size:12px;color:var(--text3);border:1px dashed var(--border);border-radius:8px">Vazio</div>`
                : items.map(t => `
                  <div class="kanban-card" onclick="openTaskDetail('${t.id}')">
                    <div class="kanban-card-title">${t.title}</div>
                    <div class="kanban-card-meta">
                      ${priorityBadge(t.priority)}
                      ${t.due_date ? `<span class="task-due ${t.due_date < today_iso() ? 'overdue':''}" style="font-size:11px">${fmt_date(t.due_date)}</span>` : ''}
                    </div>
                  </div>`).join('')
              }
            </div>
          </div>`
        }).join('')}
      </div>
    </div>

    <!-- LIST -->
    <div id="tab-list" class="tab-pane">
      <div class="card" style="padding:0">
        ${all.length === 0
          ? `<div class="empty-state"><div class="empty-icon">✅</div><h3>Sem tarefas</h3><p>Crie sua primeira tarefa</p></div>`
          : all.map(t => `
            <div class="task-row" style="padding:12px 16px" onclick="openTaskDetail('${t.id}')">
              <div class="task-check ${t.status==='done'?'done':''}" onclick="toggleTask(event,'${t.id}','${t.status}')">
                ${t.status==='done'?'✓':''}
              </div>
              <div style="flex:1;min-width:0">
                <div class="task-title ${t.status==='done'?'done':''}">${t.title}</div>
                <div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">
                  ${taskBadge(t.status)} ${priorityBadge(t.priority)}
                </div>
              </div>
              <span class="task-due ${t.due_date && t.due_date < today_iso() ? 'overdue':''}">${t.due_date ? fmt_date(t.due_date) : ''}</span>
            </div>`).join('')
        }
      </div>
    </div>
  `
}

async function toggleTask(e, id, currentStatus) {
  e.stopPropagation()
  const newStatus = currentStatus === 'done' ? 'todo' : 'done'
  await DB.update('tasks', id, { status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : null })
  showToast(newStatus === 'done' ? 'Tarefa concluída! ✅' : 'Tarefa reaberta')
  navigate('tasks')
}

function openAddTask() {
  openModal('Nova Tarefa',
    `<div class="field-group"><label class="field-label">Título *</label><input type="text" id="t-title" placeholder="O que precisa ser feito?"/></div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Status</label>
         <select id="t-status">
           <option value="inbox">Inbox</option><option value="todo">A Fazer</option>
           <option value="in_progress">Em Progresso</option><option value="waiting">Aguardando</option>
         </select>
       </div>
       <div class="field-group"><label class="field-label">Prioridade</label>
         <select id="t-priority">
           <option value="medium">Média</option><option value="low">Baixa</option>
           <option value="high">Alta</option><option value="urgent">Urgente</option>
         </select>
       </div>
     </div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Prazo</label><input type="date" id="t-due"/></div>
       <div class="field-group"><label class="field-label">Área</label><input type="text" id="t-area" placeholder="ex: trabalho, pessoal"/></div>
     </div>
     <div class="field-group"><label class="field-label">Descrição</label><textarea id="t-desc" placeholder="Detalhes opcionais..."></textarea></div>`,
    async () => {
      const title = document.getElementById('t-title').value.trim()
      if (!title) return showToast('Digite o título', 'error')
      await DB.insert('tasks', {
        user_id: AuthManager.userId(), title,
        status:      document.getElementById('t-status').value,
        priority:    document.getElementById('t-priority').value,
        due_date:    document.getElementById('t-due').value || null,
        area:        document.getElementById('t-area').value,
        description: document.getElementById('t-desc').value
      })
      closeModal(); showToast('Tarefa criada!'); navigate('tasks')
    }
  )
  setTimeout(() => document.getElementById('t-title')?.focus(), 100)
}

async function openTaskDetail(id) {
  const t = await DB.getById('tasks', id)
  if (!t) return
  openModal(t.title,
    `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
       ${taskBadge(t.status)} ${priorityBadge(t.priority)}
       ${t.due_date ? `<span class="badge badge-gray">📅 ${fmt_date(t.due_date)}</span>` : ''}
     </div>
     ${t.description ? `<p style="color:var(--text2);font-size:14px;line-height:1.6">${t.description}</p>` : ''}
     <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
       <button class="btn btn-blue btn-sm" onclick="toggleTask(event,'${t.id}','${t.status}');closeModal()">
         ${t.status==='done'?'↩ Reabrir':'✓ Concluir'}
       </button>
       <button class="btn btn-danger btn-sm" onclick="deleteTask('${t.id}')">🗑 Excluir</button>
     </div>`
  )
}

async function deleteTask(id) {
  if (!confirm('Excluir tarefa?')) return
  await DB.softDelete('tasks', id)
  closeModal(); showToast('Tarefa excluída'); navigate('tasks')
}

// ── Finance ───────────────────────────────────────────────
async function renderFinance() {
  const uid    = AuthManager.userId()
  const mStart = month_start()
  const mEnd   = month_end()
  const { data: txns } = await db.from('transactions').select('*').eq('user_id', uid).eq('is_deleted', false).gte('due_date', mStart).lte('due_date', mEnd).order('due_date', { ascending: false })
  const { data: all  } = await db.from('transactions').select('*').eq('user_id', uid).eq('is_deleted', false).order('created_at', { ascending: false }).limit(50)

  const t       = txns || []
  const income  = t.filter(x => x.type==='income').reduce((s,x)=>s+Number(x.amount),0)
  const expense = t.filter(x => x.type==='expense').reduce((s,x)=>s+Number(x.amount),0)
  const balance = income - expense
  const pending = (all||[]).filter(x => !x.paid_at && x.type==='income').reduce((s,x)=>s+Number(x.amount),0)
  const overdue = (all||[]).filter(x => !x.paid_at && x.due_date && x.due_date < today_iso()).reduce((s,x)=>s+Number(x.amount),0)
  const total   = income + expense || 1

  const now = new Date()
  const monthLabel = now.toLocaleDateString('pt-BR', { month:'long', year:'numeric' })

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Financeiro</div>
        <div style="font-size:22px;font-weight:800;text-transform:capitalize">${monthLabel}</div>
      </div>
      <button class="btn btn-blue" onclick="openAddTransaction()">＋ Lançamento</button>
    </div>

    <div class="grid-4" style="margin-bottom:24px">
      <div class="metric-card" style="background:linear-gradient(135deg,#0d1225,var(--surface));border-color:rgba(59,130,246,.2)">
        <div class="metric-label">Saldo do Mês</div>
        <div class="metric-value" style="color:${balance>=0?'var(--green)':'var(--red)'}">${fmt_currency(balance)}</div>
        <div class="finance-bar"><div class="finance-bar-income" style="width:${Math.round((income/total)*100)}%"></div></div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Receitas</div>
        <div class="metric-value" style="color:var(--green)">${fmt_currency(income)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Despesas</div>
        <div class="metric-value" style="color:var(--red)">${fmt_currency(expense)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">A Receber</div>
        <div class="metric-value" style="color:var(--amber)">${fmt_currency(pending)}</div>
        ${overdue > 0 ? `<div class="metric-sub" style="color:var(--red)">⚠ ${fmt_currency(overdue)} vencido</div>` : ''}
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab(this,'tab-all')">Todos</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-income')">Receitas</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-expense')">Despesas</button>
      <button class="tab-btn" onclick="switchTab(this,'tab-dre')">DRE</button>
    </div>

    <div id="tab-all" class="tab-pane active">${txnTable(all||[])}</div>
    <div id="tab-income" class="tab-pane">${txnTable((all||[]).filter(x=>x.type==='income'))}</div>
    <div id="tab-expense" class="tab-pane">${txnTable((all||[]).filter(x=>x.type==='expense'))}</div>
    <div id="tab-dre" class="tab-pane">${dreTable(income, expense)}</div>
  `
}

function txnTable(list) {
  if (!list.length) return `<div class="empty-state"><div class="empty-icon">💸</div><p>Nenhum lançamento</p></div>`
  return `<div class="card" style="padding:0"><div class="table-wrap"><table>
    <thead><tr><th>Descrição</th><th>Tipo</th><th>Valor</th><th>Vencimento</th><th>Status</th><th></th></tr></thead>
    <tbody>
    ${list.map(t => `
      <tr>
        <td style="font-weight:500;color:var(--text)">${t.title}</td>
        <td>${t.type==='income' ? `<span class="badge badge-green">Receita</span>` : `<span class="badge badge-red">Despesa</span>`}</td>
        <td style="font-weight:600;color:${t.type==='income'?'var(--green)':'var(--red)'}">${t.type==='income'?'+':'-'}${fmt_currency(t.amount)}</td>
        <td>${fmt_date(t.due_date)}</td>
        <td>${t.paid_at ? `<span class="badge badge-green">Pago</span>` : `<span class="badge badge-amber">Pendente</span>`}</td>
        <td>
          ${!t.paid_at ? `<button class="btn btn-outline btn-sm" onclick="markPaid('${t.id}')">Marcar pago</button>` : ''}
        </td>
      </tr>`).join('')}
    </tbody></table></div></div>`
}

function dreTable(income, expense) {
  const liq = income * 0.885
  const fix = expense * 0.6
  const vari = expense * 0.4
  const profit = liq - fix - vari
  const rows = [
    ['Receita Bruta', income, 'var(--green)', false],
    ['(-) Impostos est. (11.5%)', income * 0.115, 'var(--red)', true],
    ['= Receita Líquida', liq, 'var(--text)', false, true],
    ['(-) Despesas Fixas', fix * -1, 'var(--red)', true],
    ['(-) Despesas Variáveis', vari * -1, 'var(--red)', true],
    ['= Lucro Operacional', profit, profit>=0?'var(--green)':'var(--red)', false, true],
  ]
  return `<div class="card"><h3 style="margin-bottom:16px;font-size:15px">DRE Simplificado</h3>
    ${rows.map(([l,v,c,ind,bold])=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);${bold?'font-weight:700':''}">
        <span style="color:var(--text2);${ind?'padding-left:16px':''}${bold?';color:var(--text)':''}">${l}</span>
        <span style="color:${c}">${fmt_currency(Math.abs(v))}</span>
      </div>`).join('')}
    <p style="font-size:11px;color:var(--text3);margin-top:12px">* Estimativa simplificada.</p>
  </div>`
}

async function markPaid(id) {
  await DB.update('transactions', id, { paid_at: new Date().toISOString() })
  showToast('Marcado como pago ✅'); navigate('finance')
}

function openAddTransaction() {
  openModal('Novo Lançamento',
    `<div style="display:flex;gap:0;background:var(--bg2);border-radius:var(--radius-md);padding:4px;margin-bottom:4px">
       <button id="type-income" class="tab-btn active" onclick="setTxnType('income')">💚 Receita</button>
       <button id="type-expense" class="tab-btn" onclick="setTxnType('expense')">🔴 Despesa</button>
     </div>
     <input type="hidden" id="txn-type" value="income"/>
     <div class="field-group"><label class="field-label">Título *</label><input type="text" id="txn-title" placeholder="Descrição do lançamento"/></div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Valor (R$) *</label><input type="number" id="txn-amount" placeholder="0,00" step="0.01"/></div>
       <div class="field-group"><label class="field-label">Vencimento</label><input type="date" id="txn-due" value="${today_iso()}"/></div>
     </div>
     <div class="field-group">
       <label class="field-label">Já foi pago?</label>
       <select id="txn-paid"><option value="">Não (pendente)</option><option value="yes">Sim</option></select>
     </div>`,
    async () => {
      const title  = document.getElementById('txn-title').value.trim()
      const amount = parseFloat(document.getElementById('txn-amount').value)
      if (!title || !amount) return showToast('Preencha título e valor', 'error')
      const isPaid = document.getElementById('txn-paid').value === 'yes'
      await DB.insert('transactions', {
        user_id: AuthManager.userId(),
        type:     document.getElementById('txn-type').value,
        title, amount,
        due_date: document.getElementById('txn-due').value || null,
        paid_at:  isPaid ? new Date().toISOString() : null
      })
      closeModal(); showToast('Lançamento salvo!'); navigate('finance')
    }
  )
}

function setTxnType(type) {
  document.getElementById('txn-type').value = type
  document.getElementById('type-income').classList.toggle('active', type==='income')
  document.getElementById('type-expense').classList.toggle('active', type==='expense')
}

// ── Projects ──────────────────────────────────────────────
async function renderProjects() {
  const uid = AuthManager.userId()
  const { data: projects } = await db.from('projects').select('*, clients(name)').eq('user_id', uid).eq('is_deleted', false).order('updated_at', { ascending: false })
  const list = projects || []

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Projetos</div>
        <div style="font-size:26px;font-weight:800">${list.filter(p=>p.status!=='delivered'&&p.status!=='archived').length} ativos</div>
      </div>
      <button class="btn btn-blue" onclick="openAddProject()">＋ Novo Projeto</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
      ${list.length === 0
        ? `<div class="empty-state"><div class="empty-icon">🎬</div><h3>Sem projetos</h3><p>Crie seu primeiro projeto</p><button class="btn btn-blue" onclick="openAddProject()">Novo Projeto</button></div>`
        : list.map(p => `
          <div class="card" onclick="openProjectDetail('${p.id}')" style="cursor:pointer">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <div style="width:12px;height:12px;border-radius:50%;background:${p.color||'#3b82f6'};flex-shrink:0"></div>
              <span style="font-weight:700;font-size:15px;flex:1">${p.name}</span>
              ${projectBadge(p.status)}
            </div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--text3)">
              ${p.clients?.name ? `<span>👥 ${p.clients.name}</span>` : ''}
              ${p.delivery_date ? `<span>📅 ${fmt_date(p.delivery_date)}</span>` : ''}
              ${p.budget ? `<span>💰 ${fmt_currency(p.budget)}</span>` : ''}
            </div>
          </div>`).join('')
      }
    </div>`
}

async function openProjectDetail(id) {
  const p = await db.from('projects').select('*, clients(name)').eq('id', id).single()
  if (!p.data) return
  const proj = p.data
  openModal(proj.name,
    `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
       ${projectBadge(proj.status)}
       ${proj.clients?.name ? `<span class="badge badge-gray">👥 ${proj.clients.name}</span>` : ''}
     </div>
     <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
       <div class="metric-card"><div class="metric-label">Budget</div><div style="font-weight:700">${fmt_currency(proj.budget)}</div></div>
       <div class="metric-card"><div class="metric-label">Entrega</div><div style="font-weight:700">${fmt_date(proj.delivery_date)}</div></div>
     </div>
     ${proj.description ? `<p style="color:var(--text2);font-size:14px;line-height:1.6;margin-bottom:14px">${proj.description}</p>` : ''}
     <div style="display:flex;gap:8px;flex-wrap:wrap">
       <button class="btn btn-outline btn-sm" onclick="updateProjectStatus('${proj.id}','recording')">🔴 Gravar</button>
       <button class="btn btn-outline btn-sm" onclick="updateProjectStatus('${proj.id}','editing')">✂️ Editar</button>
       <button class="btn btn-outline btn-sm" onclick="updateProjectStatus('${proj.id}','review')">👁 Revisão</button>
       <button class="btn btn-blue btn-sm" onclick="updateProjectStatus('${proj.id}','delivered')">✅ Entregar</button>
     </div>`
  )
}

async function updateProjectStatus(id, status) {
  await DB.update('projects', id, { status })
  closeModal(); showToast(`Status: ${PROJECT_STATUS[status]?.label}`); navigate('projects')
}

function openAddProject() {
  openModal('Novo Projeto',
    `<div class="field-group"><label class="field-label">Nome *</label><input type="text" id="p-name" placeholder="Nome do projeto"/></div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Budget (R$)</label><input type="number" id="p-budget" placeholder="0,00" step="0.01"/></div>
       <div class="field-group"><label class="field-label">Data de Entrega</label><input type="date" id="p-delivery"/></div>
     </div>
     <div class="field-group"><label class="field-label">Descrição / Briefing</label><textarea id="p-desc" placeholder="Descreva o projeto..."></textarea></div>`,
    async () => {
      const name = document.getElementById('p-name').value.trim()
      if (!name) return showToast('Digite o nome', 'error')
      await DB.insert('projects', {
        user_id:       AuthManager.userId(),
        name,
        budget:        parseFloat(document.getElementById('p-budget').value) || 0,
        delivery_date: document.getElementById('p-delivery').value || null,
        description:   document.getElementById('p-desc').value,
        status:        'briefing'
      })
      closeModal(); showToast('Projeto criado!'); navigate('projects')
    }
  )
}

// ── Clients ───────────────────────────────────────────────
async function renderClients() {
  const { data: clients } = await db.from('clients').select('*').eq('user_id', AuthManager.userId()).eq('is_deleted', false).order('name')
  const list = clients || []

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Clientes</div>
        <div style="font-size:26px;font-weight:800">${list.length} cadastrados</div>
      </div>
      <button class="btn btn-blue" onclick="openAddClient()">＋ Novo Cliente</button>
    </div>
    <div class="card" style="padding:0">
      ${list.length === 0
        ? `<div class="empty-state"><div class="empty-icon">👥</div><h3>Sem clientes</h3><p>Adicione seu primeiro cliente</p><button class="btn btn-blue" style="margin-top:14px" onclick="openAddClient()">Novo Cliente</button></div>`
        : `<div class="table-wrap"><table>
            <thead><tr><th>Nome</th><th>Empresa</th><th>Nicho</th><th>Pipeline</th><th>Contato</th></tr></thead>
            <tbody>
            ${list.map(c => `
              <tr onclick="openClientDetail('${c.id}')" style="cursor:pointer">
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:34px;height:34px;border-radius:50%;background:rgba(59,130,246,.15);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:var(--blue);flex-shrink:0">
                      ${c.name.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-weight:600;color:var(--text)">${c.name}</span>
                  </div>
                </td>
                <td>${c.company || '—'}</td>
                <td>${c.niche || '—'}</td>
                <td>${pipelineBadge(c.pipeline_stage)}</td>
                <td>${c.phone || c.email || '—'}</td>
              </tr>`).join('')}
            </tbody></table></div>`
      }
    </div>`
}

async function openClientDetail(id) {
  const c = await DB.getById('clients', id)
  if (!c) return
  openModal(c.name,
    `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
       ${pipelineBadge(c.pipeline_stage)}
       ${c.niche ? `<span class="badge badge-gray">${c.niche}</span>` : ''}
     </div>
     <div style="display:flex;flex-direction:column;gap:8px;font-size:14px;color:var(--text2)">
       ${c.company ? `<div>🏢 ${c.company}</div>` : ''}
       ${c.email   ? `<div>✉️ ${c.email}</div>`   : ''}
       ${c.phone   ? `<div>📞 ${c.phone}</div>`   : ''}
       ${c.instagram ? `<div>📷 ${c.instagram}</div>` : ''}
     </div>
     ${c.notes ? `<p style="color:var(--text3);font-size:13px;margin-top:12px;line-height:1.6">${c.notes}</p>` : ''}
     <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
       <button class="btn btn-danger btn-sm" onclick="deleteClient('${c.id}')">🗑 Excluir</button>
     </div>`
  )
}

async function deleteClient(id) {
  if (!confirm('Excluir cliente?')) return
  await DB.softDelete('clients', id)
  closeModal(); showToast('Cliente excluído'); navigate('clients')
}

function openAddClient() {
  openModal('Novo Cliente',
    `<div class="form-row">
       <div class="field-group"><label class="field-label">Nome *</label><input type="text" id="c-name"/></div>
       <div class="field-group"><label class="field-label">Empresa</label><input type="text" id="c-company"/></div>
     </div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">E-mail</label><input type="email" id="c-email"/></div>
       <div class="field-group"><label class="field-label">Telefone</label><input type="tel" id="c-phone"/></div>
     </div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Instagram</label><input type="text" id="c-insta" placeholder="@usuario"/></div>
       <div class="field-group"><label class="field-label">Nicho</label>
         <select id="c-niche">
           <option value="gastronomy">Gastronomia</option><option value="branding">Branding</option>
           <option value="fashion">Moda</option><option value="beauty">Beleza</option>
           <option value="events">Eventos</option><option value="corporate">Corporativo</option>
           <option value="other">Outro</option>
         </select>
       </div>
     </div>
     <div class="field-group"><label class="field-label">Observações</label><textarea id="c-notes"></textarea></div>`,
    async () => {
      const name = document.getElementById('c-name').value.trim()
      if (!name) return showToast('Digite o nome', 'error')
      await DB.insert('clients', {
        user_id: AuthManager.userId(), name,
        company:   document.getElementById('c-company').value,
        email:     document.getElementById('c-email').value,
        phone:     document.getElementById('c-phone').value,
        instagram: document.getElementById('c-insta').value,
        niche:     document.getElementById('c-niche').value,
        notes:     document.getElementById('c-notes').value,
        pipeline_stage: 'lead'
      })
      closeModal(); showToast('Cliente salvo!'); navigate('clients')
    }
  )
}

// ── Agenda ─────────────────────────────────────────────────
async function renderAgenda() {
  const uid = AuthManager.userId()
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const end   = new Date(now.getFullYear(), now.getMonth()+2, 0).toISOString()
  const { data: events } = await db.from('events').select('*').eq('user_id', uid).eq('is_deleted', false).gte('start_at', start).lte('start_at', end).order('start_at')
  const list = events || []

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Agenda</div>
        <div style="font-size:26px;font-weight:800">${now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</div>
      </div>
      <button class="btn btn-blue" onclick="openAddEvent()">＋ Novo Evento</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px" class="agenda-cols">
      <div>
        <div id="cal-widget"></div>
      </div>
      <div>
        <div class="section-header"><span class="section-label">Próximos Eventos</span></div>
        <div class="card" style="padding:12px 16px">
          ${list.length === 0
            ? `<div class="empty-state" style="padding:20px"><p>Nenhum evento</p></div>`
            : list.map(ev => {
                const cat = EVENT_CATEGORY[ev.category] || EVENT_CATEGORY.other
                return `<div class="event-row">
                  <div class="event-bar" style="background:${cat.color}"></div>
                  <div style="flex:1">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start">
                      <div>
                        <div class="event-time">${new Date(ev.start_at).toLocaleString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</div>
                        <div class="event-title">${ev.title}</div>
                        ${ev.location ? `<div class="event-loc">📍 ${ev.location}</div>` : ''}
                      </div>
                      <span class="badge" style="background:${cat.color}22;color:${cat.color};border-color:${cat.color}44;font-size:10px">${cat.label}</span>
                    </div>
                  </div>
                </div>`
              }).join('')
          }
        </div>
      </div>
    </div>`

  renderCalWidget(list)
  if (window.innerWidth < 769) {
    document.querySelector('.agenda-cols').style.gridTemplateColumns = '1fr'
  }
}

function renderCalWidget(events) {
  const el = document.getElementById('cal-widget')
  if (!el) return
  const now = new Date()
  const year = now.getFullYear(), month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const dayLabels = ['D','S','T','Q','Q','S','S']
  const eventDays = new Set(events.map(e => new Date(e.start_at).getDate()))

  el.innerHTML = `
    <div class="cal-month">
      <div class="cal-header">
        <span style="font-size:15px;font-weight:700">${now.toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</span>
      </div>
      <div class="cal-days-header">${dayLabels.map(d=>`<span>${d}</span>`).join('')}</div>
      <div class="cal-grid">
        ${Array(firstDay).fill('<div></div>').join('')}
        ${Array.from({length:daysInMonth},(_,i)=>{
          const d = i+1
          const isToday = d === now.getDate()
          const hasEvent = eventDays.has(d)
          return `<div class="cal-day ${isToday?'today':''}">
            <span class="day-num">${d}</span>
            ${hasEvent ? '<div class="cal-dot"></div>' : ''}
          </div>`
        }).join('')}
      </div>
    </div>`
}

function openAddEvent() {
  openModal('Novo Evento',
    `<div class="field-group"><label class="field-label">Título *</label><input type="text" id="ev-title" placeholder="Nome do evento"/></div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Início *</label><input type="datetime-local" id="ev-start"/></div>
       <div class="field-group"><label class="field-label">Fim</label><input type="datetime-local" id="ev-end"/></div>
     </div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Categoria</label>
         <select id="ev-cat">
           <option value="recording">Gravação</option><option value="meeting">Reunião</option>
           <option value="personal">Pessoal</option><option value="financial">Financeiro</option>
           <option value="deadline">Entrega</option><option value="other">Outro</option>
         </select>
       </div>
       <div class="field-group"><label class="field-label">Localização</label><input type="text" id="ev-loc" placeholder="Onde?"/></div>
     </div>`,
    async () => {
      const title = document.getElementById('ev-title').value.trim()
      const start = document.getElementById('ev-start').value
      if (!title || !start) return showToast('Título e início são obrigatórios', 'error')
      const end = document.getElementById('ev-end').value || start
      await DB.insert('events', {
        user_id:  AuthManager.userId(),
        title, category: document.getElementById('ev-cat').value,
        location: document.getElementById('ev-loc').value,
        start_at: new Date(start).toISOString(),
        end_at:   new Date(end).toISOString()
      })
      closeModal(); showToast('Evento criado!'); navigate('agenda')
    }
  )
}

// ── Goals ─────────────────────────────────────────────────
async function renderGoals() {
  const { data: goals } = await db.from('goals').select('*').eq('user_id', AuthManager.userId()).eq('is_deleted', false).eq('is_archived', false).order('sort_order')
  const list = goals || []

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Metas & Hábitos</div>
        <div style="font-size:26px;font-weight:800">${list.length} ativas</div>
      </div>
      <button class="btn btn-blue" onclick="openAddGoal()">＋ Nova Meta</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${list.length === 0
        ? `<div class="empty-state"><div class="empty-icon">🎯</div><h3>Sem metas</h3><p>Defina suas metas</p><button class="btn btn-blue" style="margin-top:14px" onclick="openAddGoal()">Nova Meta</button></div>`
        : list.map(g => {
            const progress = Math.min((g.current_value / g.target_value) * 100, 100) || 0
            return `
              <div class="goal-card">
                <div class="goal-header">
                  <div style="font-weight:700;font-size:15px">${g.title}</div>
                  <span class="badge badge-blue">${g.period}</span>
                </div>
                <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px">
                  <div class="goal-percent" style="color:${g.color||'var(--blue)'}">${Math.round(progress)}%</div>
                  <span style="font-size:12px;color:var(--text3)">${g.current_value} / ${g.target_value} ${g.unit}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${progress}%;background:${g.color||'var(--blue)'}"></div></div>
                ${g.is_habit ? `<div class="goal-streak">🔥 ${g.streak_days} dias seguidos · Recorde: ${g.best_streak}</div>` : ''}
                <div style="margin-top:12px;display:flex;gap:8px">
                  <button class="btn btn-outline btn-sm" onclick="checkinGoal('${g.id}',${g.current_value},${g.target_value},${g.is_habit},${g.streak_days},${g.best_streak})">+1 Check-in</button>
                </div>
              </div>`
          }).join('')
      }
    </div>`
}

async function checkinGoal(id, current, target, isHabit, streak, best) {
  const newVal = Math.min(current + 1, target)
  const updates = { current_value: newVal }
  if (isHabit) {
    updates.streak_days = streak + 1
    updates.best_streak = Math.max(best, streak + 1)
    updates.last_check_in = today_iso()
  }
  if (newVal >= target) updates.is_completed = true
  await DB.update('goals', id, updates)
  showToast(newVal >= target ? '🎯 Meta atingida!' : 'Check-in registrado!')
  navigate('goals')
}

function openAddGoal() {
  openModal('Nova Meta',
    `<div class="field-group"><label class="field-label">Título *</label><input type="text" id="g-title" placeholder="ex: Faturar R$ 20.000"/></div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Valor Alvo *</label><input type="number" id="g-target" placeholder="100"/></div>
       <div class="field-group"><label class="field-label">Unidade</label><input type="text" id="g-unit" placeholder="%" value="%"/></div>
     </div>
     <div class="form-row">
       <div class="field-group"><label class="field-label">Período</label>
         <select id="g-period">
           <option value="monthly">Mensal</option><option value="weekly">Semanal</option>
           <option value="annual">Anual</option><option value="daily">Diário</option>
         </select>
       </div>
       <div class="field-group"><label class="field-label">Tipo</label>
         <select id="g-type">
           <option value="financial">Financeiro</option><option value="projects">Projetos</option>
           <option value="content">Conteúdo</option><option value="personal">Pessoal</option>
           <option value="habit">Hábito</option>
         </select>
       </div>
     </div>
     <div class="field-group" style="flex-direction:row;align-items:center;gap:10px">
       <input type="checkbox" id="g-habit" style="width:auto"/>
       <label class="field-label" style="margin:0">É um hábito recorrente?</label>
     </div>`,
    async () => {
      const title = document.getElementById('g-title').value.trim()
      const target = parseFloat(document.getElementById('g-target').value)
      if (!title || !target) return showToast('Preencha título e valor alvo', 'error')
      await DB.insert('goals', {
        user_id:      AuthManager.userId(),
        title, target_value: target,
        unit:         document.getElementById('g-unit').value || '%',
        period:       document.getElementById('g-period').value,
        type:         document.getElementById('g-type').value,
        is_habit:     document.getElementById('g-habit').checked,
        period_ref:   new Date().getFullYear().toString(),
        current_value: 0
      })
      closeModal(); showToast('Meta criada!'); navigate('goals')
    }
  )
}

// ── Notes ─────────────────────────────────────────────────
async function renderNotes() {
  const { data: notes } = await db.from('notes').select('*').eq('user_id', AuthManager.userId()).eq('is_deleted', false).order('updated_at', { ascending: false })
  const list = notes || []
  const pinned  = list.filter(n => n.is_pinned)
  const regular = list.filter(n => !n.is_pinned)

  document.getElementById('page-content').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:12px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px">Notas</div>
        <div style="font-size:26px;font-weight:800">${list.length} notas</div>
      </div>
      <button class="btn btn-blue" onclick="openNoteEditor()">＋ Nova Nota</button>
    </div>
    ${pinned.length ? `
      <div class="section-header"><span class="section-label">📌 Fixadas</span></div>
      <div class="notes-grid" style="margin-bottom:24px">${pinned.map(noteCard).join('')}</div>` : ''}
    ${regular.length ? `
      <div class="section-header"><span class="section-label">Recentes</span></div>
      <div class="notes-grid">${regular.map(noteCard).join('')}</div>` : ''}
    ${list.length === 0
      ? `<div class="empty-state"><div class="empty-icon">📝</div><h3>Sem notas</h3><p>Capture suas ideias</p><button class="btn btn-blue" style="margin-top:14px" onclick="openNoteEditor()">Nova Nota</button></div>` : ''}
  `
}

function noteCard(n) {
  return `<div class="note-card" onclick="openNoteEditor('${n.id}')">
    <div class="note-card-title">${n.title || 'Sem título'}</div>
    ${n.content ? `<div class="note-card-body">${n.content}</div>` : ''}
    <div class="note-card-date">${fmt_datetime(n.updated_at)}</div>
  </div>`
}

async function openNoteEditor(id) {
  let note = null
  if (id) { const r = await DB.getById('notes', id); note = r }
  openModal(note ? 'Editar Nota' : 'Nova Nota',
    `<div class="field-group"><label class="field-label">Título</label><input type="text" id="n-title" value="${note?.title||''}" placeholder="Título da nota"/></div>
     <div class="field-group"><label class="field-label">Conteúdo</label><textarea id="n-content" style="min-height:200px" placeholder="Escreva aqui... (suporta Markdown)">${note?.content||''}</textarea></div>
     <div style="display:flex;align-items:center;gap:10px">
       <input type="checkbox" id="n-pinned" style="width:auto" ${note?.is_pinned?'checked':''}/>
       <label class="field-label" style="margin:0">Fixar nota</label>
       <input type="checkbox" id="n-fav" style="width:auto;margin-left:12px" ${note?.is_favorite?'checked':''}/>
       <label class="field-label" style="margin:0">Favorita</label>
     </div>`,
    async () => {
      const title   = document.getElementById('n-title').value.trim()
      const content = document.getElementById('n-content').value
      const isPinned = document.getElementById('n-pinned').checked
      const isFav    = document.getElementById('n-fav').checked
      if (!title && !content) return showToast('Escreva algo', 'error')
      if (note) {
        await DB.update('notes', note.id, { title: title||'Sem título', content, is_pinned: isPinned, is_favorite: isFav, word_count: content.split(' ').length })
      } else {
        await DB.insert('notes', { user_id: AuthManager.userId(), title: title||'Sem título', content, is_pinned: isPinned, is_favorite: isFav, word_count: content.split(' ').length })
      }
      closeModal(); showToast('Nota salva!'); navigate('notes')
    }
  )
}

// ── Tab switch helper ─────────────────────────────────────
function switchTab(btn, paneId) {
  const parent = btn.closest('.tabs')
  parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  const container = parent.nextElementSibling?.parentElement || document
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'))
  document.getElementById(paneId)?.classList.add('active')
}
