import QRCode from 'https://cdn.skypack.dev/qrcode'

// --- DOM ---
const $longUrl = document.getElementById('longUrl')
const $shortenBtn = document.getElementById('shortenBtn')
const $userResult = document.getElementById('userResult')
const $userQrCode = document.getElementById('userQrCode')
const $staticProjects = document.getElementById('staticProjects')

// --- Estado (opcional) ---
const LS_KEY_LAST_URL = 'qr:lastUrl'

// --- Init ---
initApp()

// Enter o click para generar
$longUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGenerate()
})

$shortenBtn.addEventListener('click', handleGenerate)

async function initApp() {
  // Oculta el resultado al cargar
  $userResult.style.display = 'none'

  // Rellena con la última URL usada (si existe)
  const last = localStorage.getItem(LS_KEY_LAST_URL)
  if (last) $longUrl.value = last

  // Carga proyectos estáticos
  await renderStaticProjects()
}

function isValidURL(url) {
  // Acepta http/https (recomendado para abrir bien en móviles)
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

async function handleGenerate() {
  const raw = $longUrl.value.trim()
  if (!raw) return

  if (!isValidURL(raw)) {
    alert('Please enter a valid URL starting with http:// or https://')
    $longUrl.focus()
    return
  }

  // Guarda la última URL ingresada
  localStorage.setItem(LS_KEY_LAST_URL, raw)

  // Renderiza resultado + QR
  await renderResult(raw)
}

async function renderResult(urlToEncode) {
  // Limpia estado previo
  $userQrCode.innerHTML = ''

  // Muestra el bloque de resultado
  $userResult.style.display = 'block'

  try {
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, urlToEncode, {
      width: 220,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
    $userQrCode.appendChild(canvas)
  } catch (err) {
    console.error('Error generando QR:', err)
    $userQrCode.textContent = 'Error generating QR'
  }
}

async function renderStaticProjects() {
  try {
    const res = await fetch('../data/projects.json', { cache: 'no-store' })
    const data = await res.json()
    const list = Array.isArray(data.projects) ? data.projects : []

    if (!list.length) {
      $staticProjects.innerHTML = '<p>No projects to display.</p>'
      return
    }

    // Limpia
    $staticProjects.innerHTML = ''

    for (const project of list) {
      const article = document.createElement('article')
      article.classList.add('project-item')

      const title = document.createElement('h3')
      title.textContent = project.name ?? 'Untitled'

      const desc = document.createElement('p')
      desc.textContent = project.description ?? ''

      const link = document.createElement('a')
      link.href = project.url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.textContent = project.url

      // contenedor para el QR
      const qrDiv = document.createElement('div')
      qrDiv.classList.add('project-qr')

      // genera QR en canvas
      if (project.url) {
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, project.url, {
          width: 120,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        })
        qrDiv.appendChild(canvas)
      }

      article.appendChild(title)
      article.appendChild(desc)
      article.appendChild(link)
      article.appendChild(qrDiv)

      $staticProjects.appendChild(article)
    }
  } catch (e) {
    console.error('Error loading projects.json:', e)
    $staticProjects.innerHTML = '<p>Error loading projects.</p>'
  }
}
