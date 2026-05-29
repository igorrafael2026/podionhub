// ============================================================
// IgorOS — Supabase Client
// ============================================================

const SUPABASE_URL = 'https://prdhepsnksfebunnprsn.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZGhlcHNua3NmZWJ1bm5wcnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Mzc1MTcsImV4cCI6MjA5NTQxMzUxN30.475IfPjjQw6emgE3oGIyRzXmfSwByOTpcvWsughGtN0'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Helpers genéricos ──────────────────────────────────────
const DB = {
  async getAll(table, extra = {}) {
    let q = db.from(table).select('*').eq('is_deleted', false).order('created_at', { ascending: false })
    if (extra.order) q = db.from(table).select('*').eq('is_deleted', false).order(extra.order, { ascending: extra.asc ?? true })
    const { data, error } = await q
    if (error) throw error
    return data || []
  },

  async insert(table, payload) {
    const { data, error } = await db.from(table).insert(payload).select().single()
    if (error) throw error
    return data
  },

  async update(table, id, payload) {
    const { data, error } = await db.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async softDelete(table, id) {
    const { error } = await db.from(table).update({ is_deleted: true, updated_at: new Date().toISOString() }).eq('id', id)
    if (error) throw error
  },

  async getById(table, id) {
    const { data, error } = await db.from(table).select('*').eq('id', id).single()
    if (error) throw error
    return data
  }
}

// ── Formatações ───────────────────────────────────────────
function fmt_currency(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
}
function fmt_date(d) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}
function fmt_datetime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })
}
function fmt_relative(d) {
  if (!d) return '—'
  const diff = Math.floor((new Date(d) - new Date()) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  if (diff === -1) return 'Ontem'
  if (diff < 0) return `${Math.abs(diff)}d atrás`
  return `em ${diff}d`
}
function today_iso() {
  return new Date().toISOString().split('T')[0]
}
function month_start() {
  const d = new Date(); d.setDate(1)
  return d.toISOString().split('T')[0]
}
function month_end() {
  const d = new Date(); d.setMonth(d.getMonth()+1); d.setDate(0)
  return d.toISOString().split('T')[0]
}

// ── Status configs ────────────────────────────────────────
const TASK_STATUS = {
  inbox:       { label: 'Inbox',       color: '#5a5966', badge: 'badge-gray' },
  todo:        { label: 'A Fazer',     color: '#3b82f6', badge: 'badge-blue' },
  in_progress: { label: 'Em Progresso',color: '#f59e0b', badge: 'badge-amber' },
  waiting:     { label: 'Aguardando',  color: '#06b6d4', badge: 'badge-blue' },
  done:        { label: 'Concluído',   color: '#22c55e', badge: 'badge-green' },
  cancelled:   { label: 'Cancelado',   color: '#5a5966', badge: 'badge-gray' }
}
const TASK_PRIORITY = {
  low:    { label: 'Baixa',   badge: 'badge-gray' },
  medium: { label: 'Média',   badge: 'badge-blue' },
  high:   { label: 'Alta',    badge: 'badge-amber' },
  urgent: { label: 'Urgente', badge: 'badge-red' }
}
const PROJECT_STATUS = {
  briefing:       { label: 'Briefing',       color: '#06b6d4', badge: 'badge-blue' },
  pre_production: { label: 'Pré-Produção',   color: '#a78bfa', badge: 'badge-purple' },
  recording:      { label: 'Gravação',       color: '#ef4444', badge: 'badge-red' },
  editing:        { label: 'Edição',         color: '#f59e0b', badge: 'badge-amber' },
  review:         { label: 'Revisão',        color: '#3b82f6', badge: 'badge-blue' },
  delivered:      { label: 'Entregue',       color: '#22c55e', badge: 'badge-green' },
  archived:       { label: 'Arquivado',      color: '#5a5966', badge: 'badge-gray' }
}
const PIPELINE_STAGE = {
  lead:        { label: 'Lead',        badge: 'badge-gray' },
  contact:     { label: 'Contato',     badge: 'badge-blue' },
  proposal:    { label: 'Proposta',    badge: 'badge-blue' },
  negotiation: { label: 'Negociação',  badge: 'badge-purple' },
  active:      { label: 'Ativo',       badge: 'badge-green' },
  delivered:   { label: 'Entregue',    badge: 'badge-gray' },
  recurring:   { label: 'Recorrente',  badge: 'badge-amber' },
  lost:        { label: 'Perdido',     badge: 'badge-red' }
}
const EVENT_CATEGORY = {
  recording: { label: 'Gravação',   color: '#ef4444' },
  meeting:   { label: 'Reunião',    color: '#3b82f6' },
  personal:  { label: 'Pessoal',    color: '#a78bfa' },
  financial: { label: 'Financeiro', color: '#22c55e' },
  deadline:  { label: 'Entrega',    color: '#f59e0b' },
  other:     { label: 'Outro',      color: '#5a5966' }
}
