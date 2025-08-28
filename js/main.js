const $totalProjects = document.getElementById('totalProjects')
const $totalViews = document.getElementById('totalViews')
const $longUrl = document.getElementById('longUrl')
const $customCode = document.getElementById('customCode')
const $shortenBtn = document.getElementById('shortenBtn')
const $userResult = document.getElementById('userResult')

let STATIC_PROJECTS = []
let STATIC_STATS = {}

let URL_SHORTEN

initApp()

$longUrl.addEventListener('keypress', createShortUrl)
$shortenBtn.addEventListener('click', createShortUrl)

function createShortUrl(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    const longUrlValue = $longUrl.value.trim()

    if (!longUrlValue) {
      console.log('Please enter a valid URL')
      return
    }

    const isValid = isValidURL(longUrlValue)

    if (!isValid) {
      $longUrl.focus()
      $longUrl.value = ''
    }

    generateRandomCode(longUrlValue)
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

  loadFromLocalStorage()
}

function isValidURL(url) {
  const urlPattern = /^https?:\/\/.+\..+/
  return urlPattern.test(url)
}

function displayResult() {
  console.log('result')
}

function generateRandomCode(url) {
  URL_SHORTEN = url
  saveToLocalStorage()
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('urlShortener', JSON.stringify(URL_SHORTEN))
  } catch (error) {
    console.error('Error saving url data:', error)
  }
}

function loadFromLocalStorage() {
  try {
    URL_SHORTEN = JSON.parse(localStorage.getItem('urlShortener'))
  } catch (error) {
    console.error('Error loading url data:', error)
  }
}
