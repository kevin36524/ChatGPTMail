import 'github-markdown-css'
import { render } from 'preact'
import { unmountComponentAtNode } from 'preact/compat'
import ChatGPTCard from './ChatGPTCard'
import { config } from './search-engine-configs.mjs'
import './styles.scss'
import { getPossibleElementByQuerySelector } from './utils.mjs'

async function mount(question, siteConfig) {
  let container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const chatGPTContainer = document.querySelector('.chat-gpt-container')
  if (chatGPTContainer) {
    console.log(`KEVINDEBUG container already exists`)
    renderOrUpdateCard(question, chatGPTContainer)
    return
  }

  container.classList.add('sidebar-free')
  const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
  if (appendContainer) {
    appendContainer.appendChild(container)
  }

  renderOrUpdateCard(question, container)
}

const renderOrUpdateCard = (question, container) => {
  render(
    <ChatGPTCard
      question={question}
      triggerMode={'always'}
      closeCallback={() => {
        const siderbarContainer = document.querySelector('.sidebar-free')
        unmountComponentAtNode(siderbarContainer)
        siderbarContainer.parentElement.removeChild(siderbarContainer)
      }}
    />,
    container,
  )
}

const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName = location.hostname.match(siteRegex)[0]
const siteConfig = config[siteName]

function run() {
  console.log('KEVINDEBUG Calling run')
  const searchInput = getPossibleElementByQuerySelector(siteConfig.inputQuery)

  if (searchInput) {
    searchInput.addEventListener('keydown', function (event) {
      // Check if the key that was pressed was the enter key
      if (event.key === 'Enter') {
        // The enter key was pressed
        mount(searchInput.value, siteConfig)
      }
    })
    console.log('KEVINDEBUG Mount ChatGPT on', siteName)
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}
