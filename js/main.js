const $totalProjects = document.getElementById('totalProjects')
const $totalViews = document.getElementById('totalViews')
const $longUrl = document.getElementById('longUrl')
const $customCode = document.getElementById('customCode')
const $shortenBtn = document.getElementById('shortenBtn')
const $userResult = document.getElementById('userResult')
const $staticProjects = document.getElementById('staticProjects')

let STATIC_PROJECTS = []
let STATIC_STATS = {}

let URL_SHORTEN
let SHORTEN_URL = {}

initApp()

$longUrl.addEventListener('keypress', createShortUrl)
$shortenBtn.addEventListener('click', createShortUrl)

function createShortUrl(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    const longUrlValue = $longUrl.value.trim()
    const customURL = $customCode.value.trim()

    if (!longUrlValue) return

    const isValid = isValidURL(longUrlValue)

    if (!isValid) {
      $longUrl.focus()
      $longUrl.value = ''
    }

    let shortCode

    if (!customURL || customURL.length < 3 || customURL.length > 15) {
      shortCode = generateRandomCode()
    } else {
      const isValidCustom = isValidCustomCode(customURL)
      if (!isValidCustom) return
      shortCode = customURL
    }

    createObjUrl(longUrlValue, shortCode)
    saveToLocalStorage()
    renderResult()
  }
}

function generateRandomCode() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const minLength = 6
  const maxLength = 8
  let code = ''

  const lengthRandom =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength

  let char
  for (let i = 0; i < lengthRandom; i++) {
    char = Math.floor(Math.random() * characters.length)
    code += characters[char]
  }

  return code
}

function renderResult() {
  console.log('result')
}

function createObjUrl(longUrl, shortCode) {
  SHORTEN_URL = {
    longUrl,
    shortCode,
    createdAt: new Date().toISOString(),
  }
}

async function loadProjectsData() {
  try {
    const response = await fetch('../data/projects.json')
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Error loading projects data ', error)
  }
}

async function initApp() {
  const data = await loadProjectsData()

  STATIC_PROJECTS = data.projects
  STATIC_STATS = data.stats

  $totalProjects.textContent = STATIC_STATS.totalProjects
  $totalViews.textContent = STATIC_STATS.totalClicks

  renderStaticProjects()
  loadFromLocalStorage()
}

function renderStaticProjects() {
  if (STATIC_PROJECTS || STATIC_PROJECTS.length > 0) {
    const projectsHTML = STATIC_PROJECTS.map(
      (project) => `
       <div class="project-item">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <span>${window.location.origin}/${project.shortCode}</span>
      </div> 
    `
    )
    $staticProjects.innerHTML = projectsHTML
  }
}

function isValidURL(url) {
  const urlPattern = /^https?:\/\/.+\..+/
  return urlPattern.test(url)
}

function isValidCustomCode(customCode) {
  const isValid = /^[A-Za-z0-9-]{3,15}$/
  return isValid.test(customCode)
}
function saveToLocalStorage() {
  try {
    localStorage.setItem('urlShortener', JSON.stringify(SHORTEN_URL))
  } catch (error) {
    console.error('Error saving url data:', error)
  }
}

function loadFromLocalStorage() {
  try {
    SHORTEN_URL = JSON.parse(localStorage.getItem('urlShortener'))
  } catch (error) {
    console.error('Error loading url data:', error)
  }
}
