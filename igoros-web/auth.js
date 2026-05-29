// ============================================================
// IgorOS — Auth
// ============================================================

const AuthManager = {
  user: null,

  async init() {
    const { data: { session } } = await db.auth.getSession()
    if (session) {
      this.user = session.user
      showApp()
    } else {
      showAuth()
    }
    db.auth.onAuthStateChange((_event, session) => {
      this.user = session?.user || null
      if (this.user) showApp()
      else showAuth()
    })
  },

  async login(email, password) {
    const { data, error } = await db.auth.signInWithPassword({ email, password })
    if (error) throw error
    this.user = data.user
  },

  async signup(email, password) {
    const { data, error } = await db.auth.signUp({ email, password })
    if (error) throw error
    this.user = data.user
  },

  async logout() {
    await db.auth.signOut()
    this.user = null
  },

  userId() { return this.user?.id }
}

function showAuth() {
  document.getElementById('auth-screen').classList.remove('hidden')
  document.getElementById('app').classList.add('hidden')
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden')
  document.getElementById('app').classList.remove('hidden')
  const email = AuthManager.user?.email || ''
  document.getElementById('user-avatar').textContent = email.charAt(0).toUpperCase()
  navigate('dashboard')
}

async function handleLogin() {
  const email    = document.getElementById('auth-email').value.trim()
  const password = document.getElementById('auth-password').value
  const errEl    = document.getElementById('auth-error')
  const btn      = document.getElementById('btn-login')

  if (!email || !password) { showAuthError('Preencha e-mail e senha.'); return }
  btn.textContent = 'Entrando...'
  btn.disabled = true
  try {
    await AuthManager.login(email, password)
  } catch (e) {
    showAuthError('E-mail ou senha incorretos.')
  } finally {
    btn.textContent = 'Entrar'
    btn.disabled = false
  }
}

async function handleSignup() {
  const email    = document.getElementById('auth-email').value.trim()
  const password = document.getElementById('auth-password').value
  const btn      = document.getElementById('btn-signup')

  if (!email || !password) { showAuthError('Preencha e-mail e senha.'); return }
  if (password.length < 6) { showAuthError('Senha deve ter ao menos 6 caracteres.'); return }
  btn.textContent = 'Criando conta...'
  btn.disabled = true
  try {
    await AuthManager.signup(email, password)
    showAuthError('Conta criada! Verifique seu e-mail.', 'success')
  } catch (e) {
    showAuthError(e.message || 'Erro ao criar conta.')
  } finally {
    btn.textContent = 'Criar conta gratuita'
    btn.disabled = false
  }
}

async function handleLogout() {
  await AuthManager.logout()
}

function showAuthError(msg, type = 'error') {
  const el = document.getElementById('auth-error')
  el.textContent = msg
  el.classList.remove('hidden')
  if (type === 'success') {
    el.style.background = 'rgba(34,197,94,.1)'
    el.style.borderColor = 'rgba(34,197,94,.25)'
    el.style.color = '#22c55e'
  }
}

// Enter key no login
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('auth-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin()
  })
  AuthManager.init()
})
